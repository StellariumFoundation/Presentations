document.addEventListener('DOMContentLoaded', () => {
    const markdownInput = document.getElementById('markdownInput');
    const generatePdfButton = document.getElementById('generatePdfButton');
    const messageArea = document.getElementById('messageArea');
    const previewArea = document.getElementById('previewArea');

    // Check if Marp is loaded
    if (typeof Marp === 'undefined') {
        showMessage('Error: Marp Core library not loaded. Please check the script link in index.html.', 'error');
        console.error("Marp Core library not loaded.");
        generatePdfButton.disabled = true;
        return;
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
            // Ensure options are simple for now, customize as needed later
            const marp = new Marp.Marp({
                html: true, // Allow HTML (though Marp has its own sanitizer)
                // breaks: true, // GFM line breaks, if desired
                // themeSet: [], // If you have custom themes packaged
                // You might need to explicitly load themes if using CDN version and they are not self-contained
            }); 

            // Render the markdown
            const { html, css } = marp.render(markdownText);

            // Inject CSS into the document's head (or a specific style tag for the preview)
            // For simplicity, creating a new style tag each time. Could be optimized.
            let styleTag = document.getElementById('marp-style');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'marp-style';
                document.head.appendChild(styleTag);
            }
            styleTag.textContent = css;

            // Display HTML in the preview area
            // Marp HTML output is typically a series of <section> elements for slides.
            // The provided HTML might need a container or specific styling to display correctly.
            // For now, just injecting it directly.
            previewArea.innerHTML = html;
            
            showMessage('HTML Preview generated successfully.', 'success');

            // Placeholder for actual PDF generation and download
            // downloadPdf("dummy PDF content", "presentation.pdf");

        } catch (error) {
            console.error("Error generating HTML/CSS with Marp:", error);
            showMessage(`Error generating preview: ${error.message}`, 'error');
            previewArea.innerHTML = `<p style="color:red;">Error rendering Marp content: ${error.message}</p>`;
        }
    });

    function showMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = 'message'; // Clear existing classes
        messageArea.classList.add(type); 
        messageArea.style.display = 'block';
    }

    // Placeholder for a function to trigger PDF download
    // function downloadPdf(data, filename) {
    //     const blob = new Blob([data], { type: 'application/pdf' });
    //     const url = URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = filename;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     URL.revokeObjectURL(url);
    //     showMessage('PDF download initiated (simulated).', 'success');
    // }
});
