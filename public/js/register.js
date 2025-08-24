document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const message = document.getElementById('message');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('firstname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    console.log({ name, email, password }); 

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        message.style.color = 'green';
        message.textContent = data.message || 'REGISTRATION SUCCESSFUL! YOU CAN LOGIN TO YOUR ACCOUNT NOW!';
        registerForm.reset();
      } else {
        message.style.color = 'red';
        message.textContent = data.error || 'REGISTRATION FAILED! TRY AGAIN';
      }
    } catch (err) {
      console.error(err);
      message.style.color = 'red';
      message.textContent = 'Server error!';
    }
  });
});