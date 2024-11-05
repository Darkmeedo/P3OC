async function login(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const data = { email, password };

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseText = await response.text();

        if (response.ok) {
            const jsonResponse = JSON.parse(responseText);
            console.log('Connexion réussie :', jsonResponse);
            localStorage.setItem('loggedIn', 'true'); // Stocke l'état de connexion
            localStorage.setItem('token', jsonResponse.token);
            localStorage.setItem('userId', jsonResponse.userId);
            window.location.href = 'index.html'; // Rediriger vers index.html
    
        } else {
            console.error('Erreur de connexion :', responseText);
            alert('Veuillez entrer un email et/ou un mot de passe valide ');
        }
    } catch (error) {
        console.error('Erreur :', error);
        alert('Veuillez entrer un email et/ou un mot de passe valide ');
    }
}

document.getElementById('loginForm').addEventListener('input', function() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginBtn = document.getElementById('loginBtn');

    if (email && password) {
        loginBtn.disabled = false; 
    } else {
        loginBtn.disabled = true; 
    }
});

