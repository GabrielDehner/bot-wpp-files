const myDomain = ''
    // eslint-disable-next-line no-undef
const socket = io(myDomain)
socket.on('srv:qr', (data) => {
    const qrImg = document.getElementById('qrImg')
    if (qrImg) {
        qrImg.src = data.src
    }
})

socket.on('srv:ready', (data) => {
    // eslint-disable-next-line no-undef
    Swal.fire({
        title: 'El cliente ya se encuentra listo para operar...',
    })
    const element = document.getElementById("qrImg");
    element.remove();
})