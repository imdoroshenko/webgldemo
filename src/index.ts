window.addEventListener('load', init)

const vertexShaderSource = `
precision mediump float;
attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;

void main() 
{
  fragColor = vertColor;
  gl_Position = vec4(vertPosition, 0.0, 1.0);
}`

const fragmentSaderSource = `
precision mediump float;
varying vec3 fragColor;

void main() 
{
  gl_FragColor = vec4(fragColor, 1.0);
}
`

function init(): void {
  const
    canvas = document.createElement('canvas'),
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  if ( !gl ) {
    console.error('webgl is not supported')
    return
  }

  canvas.width = 800
  canvas.height = 500
  document.body.appendChild(canvas)

  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.75, 0.85, 0.8, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  const
    vertexShader = gl.createShader(gl.VERTEX_SHADER),
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(vertexShader, vertexShaderSource)
  gl.shaderSource(fragmentShader, fragmentSaderSource)

  gl.compileShader(vertexShader)
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader))
    return
  }

  gl.compileShader(fragmentShader)
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader))
    return
  }

  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getShaderInfoLog(program))
    return
  }
  gl.validateProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('ERROR validating program!', gl.getShaderInfoLog(program))
    return
  }

  const triangleVertices = [
    // X, Y, R, G, B
    0.0, 0.5, 1.0, 1.0, 0.0,
    -0.5, -0.5, 0.7, 0.0, 1.0,
    0.5, -0.5, 0.1, 1.0, 0.6
  ]

  const triangleVertexBufferObject = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW)

  const
    positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition'),
    colorAttributeLocation = gl.getAttribLocation(program, 'vertColor')

  gl.vertexAttribPointer(
    positionAttributeLocation,
    2,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
  )
  gl.vertexAttribPointer(
    colorAttributeLocation,
    3,
    gl.FLOAT,
    false,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  )

  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.enableVertexAttribArray(colorAttributeLocation)

  gl.useProgram(program)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}
