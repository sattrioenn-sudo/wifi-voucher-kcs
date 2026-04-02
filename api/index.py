import os
from flask import Flask, render_template, request
from supabase import create_client, Client

app = Flask(__name__, template_folder='../templates')

# AMBIL VARIABEL
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

# CEK APAKAH VARIABEL KOSONG (Ini akan muncul di Logs Vercel jika Error)
if not url or not key:
    raise ValueError("ERROR: SUPABASE_URL atau SUPABASE_KEY tidak terdeteksi di Vercel!")

# INISIALISASI
try:
    supabase: Client = create_client(url, key)
except Exception as e:
    raise Exception(f"Gagal koneksi ke Client Supabase: {str(e)}")
