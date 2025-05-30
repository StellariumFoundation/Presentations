var App = (() => {
  // script.js
  var markdownInput;
  var generatePdfButton;
  var messageArea;
  var previewArea;
  function initializeMarpDependentLogic() {
    if (generatePdfButton) {
      generatePdfButton.disabled = false;
      generatePdfButton.textContent = "Generate PDF (Preview HTML)";
    } else {
      console.error("generatePdfButton not found during Marp initialization!");
      return;
    }
    generatePdfButton.addEventListener("click", () => {
      const markdownText = markdownInput.value;
      if (!markdownText.trim()) {
        showMessage("Please enter some Markdown text.", "error");
        if (previewArea)
          previewArea.innerHTML = "";
        return;
      }
      showMessage("Generating HTML preview...", "info");
      if (previewArea)
        previewArea.innerHTML = "";
      try {
        const marp = new Marp.Marp({
          html: true
        });
        const { html, css } = marp.render(markdownText);
        let styleTag = document.getElementById("marp-style");
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = "marp-style";
          document.head.appendChild(styleTag);
        }
        styleTag.textContent = css;
        if (previewArea) {
          previewArea.innerHTML = html;
        }
        showMessage("HTML Preview generated successfully.", "success");
      } catch (error) {
        console.error("Error generating HTML/CSS with Marp:", error);
        showMessage(`Error generating preview: ${error.message}`, "error");
        if (previewArea) {
          previewArea.innerHTML = `<p style="color:red;">Error rendering Marp content: ${error.message}</p>`;
        }
      }
    });
  }
  function showMessage(message, type) {
    if (messageArea) {
      messageArea.textContent = message;
      messageArea.className = "";
      messageArea.classList.add("messageArea", type);
      messageArea.style.display = "block";
    } else {
      console.warn("Message area DOM element not found. Message:", message, "Type:", type);
      if (type === "error") {
        alert("Error: " + message + " (Message area not found)");
      }
    }
  }
  function waitForMarp(maxAttempts = 20, interval = 200) {
    let attempts = 0;
    function check() {
      if (typeof window.Marp !== "undefined" && typeof window.Marp.Marp !== "undefined") {
        console.log("Marp library loaded successfully after " + attempts + " attempts.");
        initializeMarpDependentLogic();
      } else {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(check, interval);
        } else {
          console.error("Marp library failed to load after " + maxAttempts + " attempts.");
          showMessage("Error: Marp Core library could not be loaded. Preview functionality will be disabled.", "error");
          if (generatePdfButton) {
            generatePdfButton.disabled = true;
            generatePdfButton.textContent = "Preview Disabled (Marp Lib Error)";
          }
        }
      }
    }
    check();
  }
  document.addEventListener("DOMContentLoaded", () => {
    markdownInput = document.getElementById("markdownInput");
    generatePdfButton = document.getElementById("generatePdfButton");
    messageArea = document.getElementById("messageArea");
    previewArea = document.getElementById("previewArea");
    if (!generatePdfButton) {
      showMessage("Critical Error: UI component 'generatePdfButton' not found. Page may not function.", "error");
      return;
    }
    if (!messageArea) {
      console.error("Critical Error: UI component 'messageArea' not found.");
    }
    waitForMarp();
  });
})();
