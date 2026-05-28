#!/usr/bin/env python3
"""
Analizador rápido de archivos Excel (.xls, .xlsx, .xlsm).
Genera un informe JSON y texto con: hojas, filas/columnas, primeras filas,
conteo de nulos, resumen de columnas numéricas y detección básica de columnas 'cliente' y 'total'.

Uso:
  python scripts/analyze_excel.py data/Reporte_Facturacion_Diario.xlsm --export-csv

Requiere: pandas, openpyxl
"""
import argparse
import json
import os
import sys
from typing import Any, Dict

import pandas as pd


def is_date_series(s: pd.Series) -> (bool, pd.Series):
    try:
        parsed = pd.to_datetime(s, errors="coerce", dayfirst=False)
        non_na = parsed.notna().sum()
        return (non_na >= max(1, int(len(s) * 0.5))), parsed
    except Exception:
        return False, pd.Series([pd.NaT] * len(s))


def summarize_df(df: pd.DataFrame, sample_rows: int = 6) -> Dict[str, Any]:
    summary: Dict[str, Any] = {}
    summary["shape"] = list(df.shape)
    summary["columns"] = []

    for col in df.columns:
        ser = df[col]
        col_summary: Dict[str, Any] = {
            "name": str(col),
            "missing": int(ser.isna().sum()),
            "unique": int(ser.nunique(dropna=True)),
            "inferred_dtype": pd.api.types.infer_dtype(ser, skipna=True),
        }

        # numéricos
        try:
            s_num = pd.to_numeric(ser, errors="coerce")
            if s_num.notna().any():
                # consider numeric if at least one numeric value or dtype numeric
                if pd.api.types.is_numeric_dtype(s_num) or s_num.notna().sum() > 0:
                    col_summary.update({
                        "numeric": True,
                        "sum": float(s_num.sum(skipna=True)),
                        "mean": float(s_num.mean(skipna=True)) if s_num.notna().any() else None,
                        "min": float(s_num.min(skipna=True)) if s_num.notna().any() else None,
                        "max": float(s_num.max(skipna=True)) if s_num.notna().any() else None,
                    })
                else:
                    col_summary.update({"numeric": False})
            else:
                col_summary.update({"numeric": False})
        except Exception:
            col_summary.update({"numeric": False})

        # detectar fechas
        is_date, parsed = is_date_series(ser)
        if is_date:
            col_summary.update({
                "date": True,
                "date_min": str(parsed.min()) if parsed.notna().any() else None,
                "date_max": str(parsed.max()) if parsed.notna().any() else None,
            })
        else:
            col_summary.update({"date": False})

        summary["columns"].append(col_summary)

    # sample rows (convert to serializable)
    try:
        summary["sample_head"] = df.head(sample_rows).fillna("").to_dict(orient="records")
    except Exception:
        summary["sample_head"] = []

    return summary


def find_candidate_column(columns, keywords):
    cols_low = [c.lower() for c in columns]
    for kw in keywords:
        if kw.lower() in cols_low:
            # return first matching column (case-insensitive)
            return columns[cols_low.index(kw.lower())]
    # try contains
    for i, c in enumerate(cols_low):
        for kw in keywords:
            if kw.lower() in c:
                return columns[i]
    return None


def analyze_file(path: str, export_csv: bool = False, sample_rows: int = 6) -> Dict[str, Any]:
    if not os.path.exists(path):
        raise FileNotFoundError(path)

    report: Dict[str, Any] = {"file": path, "sheets": []}

    xls = pd.ExcelFile(path, engine="openpyxl")
    sheet_names = xls.sheet_names

    for sheet in sheet_names:
        sheet_info: Dict[str, Any] = {"sheet_name": sheet}
        try:
            df = pd.read_excel(path, sheet_name=sheet, engine="openpyxl")
        except Exception as e:
            sheet_info["error"] = str(e)
            report["sheets"].append(sheet_info)
            continue

        sheet_info.update({"rows": int(df.shape[0]), "cols": int(df.shape[1])})
        sheet_info["summary"] = summarize_df(df, sample_rows=sample_rows)

        # detectar columnas candidatas
        cols = list(df.columns)
        client_col = find_candidate_column(cols, ["cliente", "client", "nombre", "customer", "name"])
        amount_col = find_candidate_column(cols, ["total", "monto", "importe", "valor", "amount", "price", "subtotal"]) 

        if client_col and amount_col:
            try:
                df_amount = pd.to_numeric(df[amount_col], errors="coerce").fillna(0)
                top_clients = (
                    df.groupby(client_col)[amount_col]
                    .sum()
                    .sort_values(ascending=False)
                    .head(10)
                    .to_dict()
                )
                sheet_info["top_clients_by_amount"] = top_clients
            except Exception:
                sheet_info["top_clients_by_amount"] = None

        # exportar CSV si solicitado
        if export_csv:
            safe_name = sheet.replace("/", "_").replace("\\", "_")
            csv_path = os.path.join("data", f"{safe_name}.csv")
            try:
                df.to_csv(csv_path, index=False)
                sheet_info["csv_exported"] = csv_path
            except Exception as e:
                sheet_info["csv_error"] = str(e)

        report["sheets"].append(sheet_info)

    # guardar reporte JSON breve
    try:
        out_json = os.path.join("data", "excel_analysis_report.json")
        with open(out_json, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        report["report_json"] = out_json
    except Exception as e:
        report["report_json_error"] = str(e)

    return report


def main():
    p = argparse.ArgumentParser(description="Analizar Excel (.xlsm) y generar resumen.")
    p.add_argument("file", help="Ruta al archivo Excel (.xlsm/.xlsx)")
    p.add_argument("--export-csv", action="store_true", help="Exportar cada hoja a CSV en data/")
    p.add_argument("--sample", type=int, default=6, help="Número de filas de muestra en salida")
    args = p.parse_args()

    try:
        report = analyze_file(args.file, export_csv=args.export_csv, sample_rows=args.sample)
    except FileNotFoundError:
        print(f"Archivo no encontrado: {args.file}")
        print("Coloca el archivo en data/ o indica la ruta correcta.")
        sys.exit(2)
    except Exception as e:
        print("Error analizando archivo:", e)
        sys.exit(3)

    # Impresión resumida en consola
    print(f"Archivo: {report.get('file')}")
    for s in report.get("sheets", []):
        print("-" * 40)
        print(f"Hoja: {s.get('sheet_name')} — filas: {s.get('rows')} cols: {s.get('cols')}")
        summ = s.get("summary")
        if summ:
            print("Columnas:")
            for c in summ.get("columns", [])[:10]:
                cname = c.get("name")
                dtype = c.get("inferred_dtype")
                missing = c.get("missing")
                numeric = c.get("numeric")
                extras = []
                if numeric:
                    extras.append(f"sum={c.get('sum')}")
                if c.get("date"):
                    extras.append(f"min={c.get('date_min')}")
                print(f"  - {cname} | {dtype} | missing={missing} {'| ' + ', '.join(extras) if extras else ''}")
        if s.get("top_clients_by_amount"):
            print("Top clientes por monto:")
            for k, v in s.get("top_clients_by_amount").items():
                print(f"  {k}: {v}")

    print("\nReporte guardado en:", report.get("report_json", "(no generado)"))


if __name__ == '__main__':
    main()
