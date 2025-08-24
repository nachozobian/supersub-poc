// Script para obtener títulos de YouTube usando web scraping
// No requiere API key, pero es menos confiable

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

// Función para obtener título usando fetch (funciona en navegador)
async function getYouTubeTitle(videoId) {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const html = await response.text();
    
    // Buscar el título en el HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      let title = titleMatch[1];
      // Limpiar el título
      title = title.replace(' - YouTube', '').trim();
      return title;
    }
    
    return `Video no encontrado: ${videoId}`;
  } catch (error) {
    console.error(`Error obteniendo video ${videoId}:`, error);
    return `Error: ${videoId}`;
  }
}

// Función para obtener todos los títulos
async function getAllTitles() {
  const results = [];
  
  for (const videoId of videoIds) {
    console.log(`Obteniendo título para ${videoId}...`);
    const title = await getYouTubeTitle(videoId);
    
    results.push({
      videoId,
      title,
      description: `Video de YouTube: ${title}`,
      duration: '00:00'
    });
    
    // Esperar un poco entre requests para no sobrecargar
    await new Promise(resolve => setTimeout(resolve, 1000));
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

// Ejecutar el script
getAllTitles().then(videos => {
  console.log('\nTítulos obtenidos:');
  videos.forEach(video => {
    console.log(`${video.videoId}: ${video.title}`);
  });
  
  console.log('\nCódigo TypeScript generado:');
  console.log(generateTypeScriptCode(videos));
}).catch(error => {
  console.error('Error:', error);
}); 