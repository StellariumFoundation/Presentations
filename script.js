// Wait for the entire page to load, including all resources like scripts
window.onload = () => {
    const markdownInput = document.getElementById('markdownInput');
    const generatePdfButton = document.getElementById('generatePdfButton');
    const messageArea = document.getElementById('messageArea');
    const previewArea = document.getElementById('previewArea');

    // Check if Marp is loaded after the window has loaded
    if (typeof Marp === 'undefined' || typeof Marp.Marp === 'undefined') {
        showMessage('Error: Marp Core library not loaded properly. The preview functionality will not work.', 'error');
        console.error("Marp Core library not loaded or Marp.Marp is not defined by window.onload.");
        if(generatePdfButton) {
            generatePdfButton.disabled = true;
            generatePdfButton.textContent = "Preview Disabled (Marp Lib Error)";
        }
        return; // Stop further execution if Marp is not available
    }

    // If Marp is loaded, enable the button (it might have been disabled by a previous failed check)
    if(generatePdfButton) {
        generatePdfButton.disabled = false;
        generatePdfButton.textContent = "Generate PDF (Preview HTML)";
    }

    generatePdfButton.addEventListener('click', () => {
        const markdownText = markdownInput.value;

        if (!markdownText.trim()) {
            showMessage('Please enter some Markdown text.', 'error');
            previewArea.innerHTML = ''; // Clear preview
            return;
        }

        showMessage('Generating HTML preview...', 'info');
        previewArea.innerHTML = ''; // Clear previous preview

        try {
            // Initialize Marp
            const marp = new Marp.Marp({
                html: true, 
            }); 

            // Render the markdown
            const { html, css } = marp.render(markdownText);

            // Inject CSS into the document's head
            let styleTag = document.getElementById('marp-style');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'marp-style';
                document.head.appendChild(styleTag);
            }
            styleTag.textContent = css;

            // Display HTML in the preview area
            previewArea.innerHTML = html;
            
            showMessage('HTML Preview generated successfully.', 'success');

        } catch (error) {
            console.error("Error generating HTML/CSS with Marp:", error);
            showMessage(`Error generating preview: ${error.message}`, 'error');
            previewArea.innerHTML = `<p style="color:red;">Error rendering Marp content: ${error.message}</p>`;
        }
    });

    function showMessage(message, type) {
        if (messageArea) {
            messageArea.textContent = message;
            messageArea.className = ''; // Clear existing classes
            // Add 'messageArea' class for base styling if you have one, then type
            messageArea.classList.add('messageArea', type); 
            messageArea.style.display = 'block';
        } else {
            console.warn("Message area not found. Message:", message, "Type:", type);
        }
    }
};

// Optional: Add a fallback if window.onload has already fired (e.g. if script is loaded dynamically late)
// However, for a script at the end of body, window.onload is generally reliable.
// If an issue persists, one might also consider a self-invoking function that checks for Marp periodically.
// For example:
// (function checkMarp() {
//   if (typeof Marp !== 'undefined' && typeof Marp.Marp !== 'undefined') {
//     // Call the main initialization function here
//     initializeApp(); 
//   } else {
//     setTimeout(checkMarp, 100); // Check again shortly
//   }
// })();
// function initializeApp() { /* ... all the code currently in window.onload ... */ }
