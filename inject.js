const fs = require('fs');
const jsxContent = fs.readFileSync('scratch_admin_jsx.txt', 'utf8');
let configPage = fs.readFileSync('frontend/src/pages/ConfigPage.tsx', 'utf8');

const startMarker = "{activeTab === 'rbac' && (";
const endMarker = ")}";

const startIndex = configPage.indexOf(startMarker);
if (startIndex !== -1) {
    // Find the matching closing parenthesis and brace
    let openCount = 1;
    let index = startIndex + startMarker.length;
    
    // We expect the block to end with "        </div>\n      )}"
    // A simpler way is to split the file by activeTab schedules
    const activeTabSchedules = "      {activeTab === 'schedules' && (";
    const nextTabIdx = configPage.indexOf(activeTabSchedules);
    
    if (nextTabIdx !== -1) {
        const before = configPage.substring(0, startIndex);
        const after = configPage.substring(nextTabIdx);
        
        const newConfigPage = before + "{activeTab === 'rbac' && (\n" + jsxContent + "\n      )}\n\n" + after;
        
        fs.writeFileSync('frontend/src/pages/ConfigPage.tsx', newConfigPage);
        console.log("Successfully replaced RBAC tab");
    } else {
        console.log("Could not find activeTab === 'schedules'");
    }
} else {
    console.log("Could not find start marker");
}
