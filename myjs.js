  document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener("click", function(event) {
      // Check if the clicked element has the class "leaf_group"
      if (event.target.classList.contains("leaf_group")) {
        // Call the function to handle displaying modal details
        lookStoryDetails(event.target);
      }

    });

    document.getElementById("send_story").addEventListener("click", function(event) {
        const storyText = document.getElementById('story_content').value;
        sendStory(storyText);
    });

    document.getElementById("btn-close-errorAlert").addEventListener("click", function(event) {
        hideErrorAlert();
    });
  function lookStoryDetails(clickedElement) {
    // Get the content of the clicked leaf
    var to_modal_title = clickedElement.querySelector(".name_on_leaf").textContent;
    var to_modal_content = clickedElement.querySelector(".story_on_leaf").textContent;
  
    // Set the modal content
    document.getElementById("modal_title").textContent = to_modal_title;
    document.getElementById("modal_content").textContent = to_modal_content;
  
    // Show the modal
    var modal = document.getElementById("myModal");
    var bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
   }

   function displayErrorAlert(message) {
    // Set the alert message
    document.getElementById('alertMessage').textContent = message;
  
    // Show the alert by changing its display style
    document.getElementById('errorAlert').style.display = 'block';
  
    // Optionally, use setTimeout to automatically hide the alert after a certain duration
    setTimeout(function() {
      hideErrorAlert();
    }, 5000); // 5000 milliseconds (5 seconds)
  }

  function hideErrorAlert() {
    // Hide the alert by changing its display style
    document.getElementById('errorAlert').style.display = 'none';
  }

   function sendStory(storyText) {
  
    const xhr = new XMLHttpRequest();
  
    // Set the method to POST and the url to the server endpoint
    xhr.open('POST', 'https://example.com/submit-story');
  
    // Set the request headers
    xhr.setRequestHeader('Content-Type', 'application/json');
  
    // Send the request with the story text as the request body
    xhr.send(JSON.stringify({ story: storyText }));
  
    // Handle the response from the server
    xhr.onload = function() {
      if (xhr.status === 200) {
        // The story was submitted successfully
        alert('Story submitted successfully!');
      } else {
        // An error occurred during submission
        displayErrorAlert(`Error submitting story: ${xhr.statusText}`);
      }
    };

    xhr.onerror = function() {
        displayErrorAlert('Error submitting story.');
      };
  }
});

  