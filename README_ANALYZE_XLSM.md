Instrucciones rápidas para analizar `Reporte_Facturacion_Diario.xlsm`

1) Copia/pega o sube el archivo Excel a la carpeta `data/` del repositorio con el nombre exacto:

   data/Reporte_Facturacion_Diario.xlsm

2) Instala dependencias (recomendado en un virtualenv):

```bash
python -m venv .venv
.venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

3) Ejecuta el script de análisis:

```bash
python scripts/analyze_excel.py data/Reporte_Facturacion_Diario.xlsm --export-csv
```

Salida:
- `data/excel_analysis_report.json` — resumen estructurado por hoja.
- (opcional) `data/<Hoja>.csv` — si pasas `--export-csv`.

Si quieres, sube el archivo aquí en el chat y puedo guardarlo en `data/` y ejecutar el análisis por ti.
