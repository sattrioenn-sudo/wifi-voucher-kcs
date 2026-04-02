import os
from flask import Flask, render_template, request
from supabase import create_client, Client
from datetime import datetime

# Inisialisasi Flask - pastikan folder templates ada di root (di luar folder api)
app = Flask(__name__, template_folder='../templates')

# --- PERBAIKAN DI SINI ---
# Kita memanggil NAMA variabelnya, nilainya diisi di dashboard Vercel
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

# Cek apakah variabel sudah terisi untuk mencegah crash saat startup
if not url or not key:
    raise ValueError("SUPABASE_URL atau SUPABASE_KEY belum diatur di Environment Variables Vercel!")

supabase: Client = create_client(url, key)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/claim', methods=['POST'])
def claim():
    nama = request.form.get('nama')
    
    try:
        # Ambil 1 voucher yang belum terpakai
        response = supabase.table("vouchers") \
            .select("*") \
            .eq("is_used", False) \
            .limit(1) \
            .execute()

        if response.data:
            voucher = response.data[0]
            # Update status voucher
            supabase.table("vouchers").update({
                "is_used": True,
                "claimed_at": datetime.now().isoformat(),
                "claimed_by": nama
            }).eq("id", voucher['id']).execute()
            
            return render_template('index.html', voucher=voucher['kode_voucher'], nama=nama)
        
        return render_template('index.html', error="Voucher sudah habis!")
    except Exception as e:
        return render_template('index.html', error=f"Database Error: {str(e)}")

# Untuk Vercel Python Runtime terbaru, objek 'app' sudah cukup.
# Hapus fungsi handler lama agar tidak bentrok.
