function onOpenCvReady() {
    if (cv.getBuildInformation) {
        console.log("OpenCV.js está listo.");
        
        document.getElementById('fileInput').addEventListener('change', function(e) {
            let file = e.target.files[0];
            let url = URL.createObjectURL(file);

            let img = new Image();
            img.onload = function() {
                let canvasOriginal = document.getElementById('canvasOriginal');
                let ctxOriginal = canvasOriginal.getContext('2d');
                let canvasProceso1 = document.getElementById('canvasProceso1');
                let ctxProceso1 = canvasProceso1.getContext('2d');
                let canvasProceso2 = document.getElementById('canvasProceso2');
                let ctxProceso2 = canvasProceso2.getContext('2d');

                // Ajustar tamaño de los canvas al de la imagen
                canvasOriginal.width = img.width;
                canvasOriginal.height = img.height;
                canvasProceso1.width = img.width;
                canvasProceso1.height = img.height;
                canvasProceso2.width = img.width;
                canvasProceso2.height = img.height;

                // Dibujar la imagen en el canvas original
                ctxOriginal.drawImage(img, 0, 0, img.width, img.height);

                // Procesamiento y visualización en los otros canvas
                let src = cv.imread(canvasOriginal);
                
                // Proceso 1: Convertir a escala de grises
                // Convertir de BGR a HSV
                let imagenHSV = new cv.Mat();
                cv.cvtColor(src, imagenHSV, cv.COLOR_BGR2HSV, 0);

                // Definir límites inferior y superior
                // verde verde
                //let limiteInferior = new cv.Mat(imagenHSV.rows, imagenHSV.cols, imagenHSV.type(), [25, 50, 0, 0]);
                //let limiteSuperior = new cv.Mat(imagenHSV.rows, imagenHSV.cols, imagenHSV.type(), [85, 255, 255, 0]);
                // 90 255
                let limiteInferior = new cv.Mat(imagenHSV.rows, imagenHSV.cols, imagenHSV.type(), [77, 75, 0, 0]);
                let limiteSuperior = new cv.Mat(imagenHSV.rows, imagenHSV.cols, imagenHSV.type(), [100, 255, 255, 0]);
                // Crear la máscara
                let mascara = new cv.Mat();
                cv.inRange(imagenHSV, limiteInferior, limiteSuperior, mascara); 

                // Aplicar la máscara para filtrar la imagen
                let imagenFiltradaHSV = new cv.Mat();
                cv.bitwise_and(imagenHSV, imagenHSV, imagenFiltradaHSV, mascara);

                // Convertir de vuelta a BGR
                let imagenFiltradaBGR = new cv.Mat();
                cv.cvtColor(imagenFiltradaHSV, imagenFiltradaBGR, cv.COLOR_HSV2BGR, 0);
                cv.imshow('canvasProceso1', imagenFiltradaHSV);
                
                // Proceso 2: Aquí puedes realizar otro procesamiento
                cv.imshow('canvasProceso2', imagenFiltradaBGR);

                // Crear enlaces para descargar las imágenes procesadas
                let downloadLink1 = document.getElementById('downloadLink1');
                canvasProceso1.toBlob(function(blob) {
                    let newUrl = URL.createObjectURL(blob);
                    downloadLink1.href = newUrl;
                }, 'image/png');

                let downloadLink2 = document.getElementById('downloadLink2');
                canvasProceso2.toBlob(function(blob) {
                    let newUrl = URL.createObjectURL(blob);
                    downloadLink2.href = newUrl;
                }, 'image/png');

                src.delete();
                imagenHSV.delete();
                limiteInferior.delete();
                limiteSuperior.delete();
                mascara.delete();
                imagenFiltradaHSV.delete();
                imagenFiltradaBGR.delete();
            }
            img.src = url;
        });

    } else {
        console.error("Error al cargar OpenCV.js");
    }
}

// Esperar a que OpenCV.js esté listo
cv['onRuntimeInitialized'] = onOpenCvReady;
// Configuración de Three.js

