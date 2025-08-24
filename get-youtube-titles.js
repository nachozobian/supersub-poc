// Script para obtener títulos reales de videos de YouTube
// Necesitas una API key de YouTube para usar este script

const videoIds = [
  'ZKOWOZBvAzl',
  'y7LDaaFeNn4', 
  'rck3MnC7OXA',
  'kXkVV7PFWgE',
  'KH-qoTqtMXE',
  'jz7tPVDwb50',
  'f0VcIWJNDAI',
  'bQ1fWZBRILo',
  '28vZa0qOHkg',
  '8unOyycCpFs',
  '1eiTXSkKFtE',
  '_mxovBWI9mO'
];

// Función para obtener títulos usando la API de YouTube
async function getYouTubeTitles(apiKey) {
  const results = [];
  
  for (const videoId of videoIds) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
      );
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        results.push({
          videoId,
          title: video.snippet.title,
          description: video.snippet.description.substring(0, 100) + '...',
          duration: '00:00', // La duración requiere otra llamada a la API
          publishedAt: video.snippet.publishedAt
        });
      } else {
        results.push({
          videoId,
          title: `Video no encontrado: ${videoId}`,
          description: 'Este video no está disponible o es privado',
          duration: '00:00',
          publishedAt: null
        });
      }
    } catch (error) {
      console.error(`Error obteniendo video ${videoId}:`, error);
      results.push({
        videoId,
        title: `Error: ${videoId}`,
        description: 'Error al obtener información del video',
        duration: '00:00',
        publishedAt: null
      });
    }
  }
  
  return results;
}

// Función para generar el código TypeScript
function generateTypeScriptCode(videos) {
  let code = '// Simple lesson data - Updated with real YouTube video titles\n';
  code += 'const sampleLessons: Lesson[] = [\n';
  
  videos.forEach((video, index) => {
    const id = index + 1;
    code += `  {\n`;
    code += `    id: '${id}',\n`;
    code += `    title: '${video.title.replace(/'/g, "\\'")}',\n`;
    code += `    duration: '${video.duration}',\n`;
    code += `    videoId: '${video.videoId}',\n`;
    code += `    completed: false,\n`;
    code += `    description: '${video.description.replace(/'/g, "\\'")}'\n`;
    code += `  },\n`;
  });
  
  code += '];\n';
  return code;
}

// Ejemplo de uso (necesitas una API key de YouTube)
// getYouTubeTitles('TU_API_KEY_AQUI').then(videos => {
//   console.log('Títulos obtenidos:', videos);
//   console.log('\nCódigo TypeScript generado:');
//   console.log(generateTypeScriptCode(videos));
// });

console.log('Para usar este script:');
console.log('1. Obtén una API key de Google Cloud Console');
console.log('2. Habilita la YouTube Data API v3');
console.log('3. Reemplaza "TU_API_KEY_AQUI" con tu API key real');
console.log('4. Ejecuta el script con Node.js'); 