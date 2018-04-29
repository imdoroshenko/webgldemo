window.addEventListener('load', init)

function init(): void {
  const
    canvas = document.createElement('canvas'),
    gl = canvas.getContext('webgl')
  canvas.width = 500
  canvas.height = 500
  document.body.appendChild(canvas)
  console.log('Hello world!')
}
