import os
from flask import Flask, render_template, request, redirect, url_for
from supabase import create_client, Client
from datetime import datetime

app = Flask(__name__, template_folder='../templates')

# Konfigurasi Supabase dari Environment Variables
url = os.environ.get("https://ugtqwxoxlmzzkxkuhpsz.supabase.co")
key = os.environ.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1Ym91cXBsa2FydHFoeHhiY3RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDgyNzQsImV4cCI6MjA5MDY4NDI3NH0.hoL_js-C4Wz9J3VJOLep-sPx5AIDwBALkULfaXTNV_4")
supabase: Client = create_client(url, key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/claim', methods=['POST'])
def claim():
    nama = request.form.get('nama')
    
    # Ambil 1 voucher yang tersedia
    response = supabase.table("vouchers") \
        .select("*") \
        .eq("is_used", False) \
        .limit(1) \
        .execute()

    if response.data:
        voucher = response.data[0]
        # Update voucher sebagai terpakai
        supabase.table("vouchers").update({
            "is_used": True,
            "claimed_at": datetime.now().isoformat(),
            "claimed_by": nama
        }).eq("id", voucher['id']).execute()
        
        return render_template('index.html', voucher=voucher['kode_voucher'], nama=nama)
    
    return render_template('index.html', error="Voucher sudah habis!")

# Penting untuk Vercel
def handler(event, context):
    return app(event, context)
