const fs = require('fs');
const html = fs.readFileSync('stitch_klinikpro_medical_frontend/admin/code.html', 'utf8');

// The main layout usually starts with the header or main tags
const start = html.indexOf('<main');
const end = html.indexOf('</main>');

if (start === -1 || end === -1) {
    console.log('No main tag');
    process.exit(1);
}

let jsx = html.substring(start, end);

// Just grab the actual content inside <main>...
const divStart = jsx.indexOf('<div');
jsx = jsx.substring(divStart);

jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');
jsx = jsx.replace(/<!--[\s\S]*?-->/g, ''); 
jsx = jsx.replace(/checked/g, 'defaultChecked'); 
jsx = jsx.replace(/selected/g, 'defaultValue'); 

['input', 'img', 'br', 'hr'].forEach(tag => {
  const regex = new RegExp('<' + tag + '([^>]*?)(?<!/)>', 'g');
  jsx = jsx.replace(regex, '<' + tag + '$1 />');
});

fs.writeFileSync('scratch_admin_jsx.txt', jsx);
console.log('Done');
