"use strict";

function main() {
    const canvas = document.querySelector("#webgl-canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) return alert("WebGL não suportado");

    // Inicia de Shaders (Função auxiliar para evitar repetição)
    const program = createProgramFromScripts(gl, "vs", "fs");
    const positionLoc = gl.getAttribLocation(program, "a_position");
    const offsetLoc = gl.getUniformLocation(program, "u_offset");
    const colorLoc = gl.getUniformLocation(program, "u_color");

    // Quadrado da estrutura
    const vertices = new Float32Array([
        -0.2, -0.2,
         0.2, -0.2,
        -0.2,  0.2,
         0.2,  0.2,
    ]);
    // Cria um buffer para armazenar um atributo de vértice
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Estrutura de Dados para os Quadrados
    const squares = [];
    const colors = [
        [0.0, 0.0, 0.0, 1.0], [1.0, 0.0, 0.0, 1.0], [0.0, 1.0, 0.0, 1.0], // Preto, Vermelho, Verde
        [0.0, 0.0, 1.0, 1.0], [1.0, 1.0, 0.0, 1.0], [1.0, 0.0, 1.0, 1.0], // Azul, Amarelo, Magenta
        [0.0, 1.0, 1.0, 1.0], [0.6, 0.6, 0.6, 1.0], [1.0, 1.0, 1.0, 1.0]  // Ciano, Cinza, Branco
    ];

    // Criação dos 9 quadrados com vertex fixos
    let colorIdx = 0;
    for (let y = 1; y >= -1; y--) {      // Linhas
        for (let x = -1; x <= 1; x++) {  // Colunas
            squares.push({
                offset: [x * 0.5, y * 0.5], // Espaçamento entre os centros
                color: colors[colorIdx++]
            });
        }
    }

    // Renderização
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Itera sobre a lista de objetos, evita repetição de código
    squares.forEach(sq => {
        gl.uniform2fv(offsetLoc, sq.offset);
        gl.uniform4fv(colorLoc, sq.color);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });
}

// Funções utilitárias para compilação de shaders
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgramFromScripts(gl, vsId, fsId) {
    const vsSource = document.getElementById(vsId).text;
    const fsSource = document.getElementById(fsId).text;
    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    return program;
}

main();