// Fungsi Login
async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('btnLogin');

    btn.innerText = 'Loading...';

    const { data, error } = await _supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Gagal login: ' + error.message);
        btn.innerText = 'Login';
    } else {
        // Jika berhasil, pindah ke halaman dashboard
        window.location.href = 'dashboard.html';
    }
}

// Fungsi Logout
async function handleLogout() {
    const { error } = await _supabase.auth.signOut();
    window.location.href = 'index.html';
}

// Cek Sesi (Cegah user masuk dashboard tanpa login)
async function checkSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session && window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
}

// Jalankan cek sesi setiap halaman dashboard dimuat
if (window.location.pathname.includes('dashboard.html')) {
    checkSession();
}
