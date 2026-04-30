async function processClaim() {
    const btn = document.getElementById('btnClaim');
    const display = document.getElementById('voucherDisplay');
    
    btn.disabled = true;
    btn.innerText = 'Memproses...';

    // 1. Ambil data user yang sedang login
    const { data: { user } } = await _supabase.auth.getUser();

    if (!user) {
        alert("Sesi habis, silakan login ulang.");
        window.location.href = 'index.html';
        return;
    }

    // 2. Cek apakah user ini sudah pernah klaim sebelumnya (Opsional: 1 user 1 voucher)
    const { data: existingClaim, error: checkError } = await _supabase
        .from('vouchers')
        .select('code')
        .eq('claimed_by', user.email)
        .single();

    if (existingClaim) {
        display.innerHTML = `Voucher kamu: <br><span style="font-size: 2rem;">${existingClaim.code}</span>`;
        display.style.color = "#28a745"; // Warna hijau kalau sudah ada
        btn.innerText = 'Sudah Diklaim';
        return;
    }

    // 3. Cari 1 voucher yang belum dipakai (is_used = false)
    const { data: voucher, error: fetchError } = await _supabase
        .from('vouchers')
        .select('*')
        .eq('is_used', false)
        .limit(1)
        .single();

    if (fetchError || !voucher) {
        alert("Maaf, stok voucher habis! Hubungi Tim IT.");
        btn.disabled = false;
        btn.innerText = 'Klaim Voucher';
        return;
    }

    // 4. Update voucher tersebut: tandai sebagai terpakai
    const { error: updateError } = await _supabase
        .from('vouchers')
        .update({ 
            is_used: true, 
            claimed_by: user.email,
            claimed_at: new Date().toISOString() 
        })
        .eq('id', voucher.id);

    if (updateError) {
        alert("Gagal mengklaim, coba lagi.");
        btn.disabled = false;
    } else {
        // Tampilkan kode ke user
        display.innerHTML = `Kode Voucher Anda: <br><span style="font-size: 2rem;">${voucher.code}</span>`;
        display.style.color = "#d63384"; // Pink kesukaan kamu
        btn.innerText = 'Berhasil!';
        
        // Tambahkan efek salin ke clipboard otomatis (opsional)
        navigator.clipboard.writeText(voucher.code);
        alert("Voucher berhasil diklaim dan disalin!");
    }
}
