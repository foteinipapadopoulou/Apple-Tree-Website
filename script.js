document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadAndDisplayLeaves();
});

function setupEventListeners() {
  document.body.addEventListener("click", handleBodyClick);
  document.getElementById("form").addEventListener("submit", handleFormSubmit);
  document.getElementById("btn-close-errorAlert").addEventListener("click", hideErrorAlert);
}

function handleBodyClick(event) {
  if (event.target.classList.contains("leaf_group") || event.target.closest('.leaf_group')) {
    // Adjusted to support clicking on child elements of .leaf_group
    displayStoryDetails(event.target.closest('.leaf_group'));
  }
}

function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  submitStory(formData);
}

function submitStory(formData) {
  // Replace the URL with your own getform endpoint
  fetch("https://getform.io/f/464d9c11-31a0-49c4-8a65-1b8f8f2b703e", {
    method: "POST",
    body: formData,
    headers: { "Accept": "application/json" },
  })
    .then(response => {
      if (response.status === 200) {
        showSuccessfulMessage('Story submitted successfully!');
        document.getElementById('form').reset();
      } else {
        displayErrorAlert(`Error submitting story: ${response.statusText}`);
      }
    })
    .catch(() => displayErrorAlert('Error submitting story.'));
}

function displayStoryDetails(clickedElement) {

  const name = clickedElement.querySelector(".name_on_leaf").textContent;
  const title = clickedElement.dataset.title; 
  const content = clickedElement.querySelector(".story_on_leaf").innerHTML;
  
  // Call a function to show these details in a modal or another display area
  showModal(name, title, content);
}

function showModal(name, title, content) {
  // Set the content in your modal or display area
  document.getElementById("modal_title").textContent = title; // Display the title in the modal
  document.getElementById("modal_content").innerHTML = `<p>${content}</p>`;

  new bootstrap.Modal(document.getElementById("myModal")).show();
}

function displayErrorAlert(message) {
  document.getElementById('alertMessage').textContent = message;
  document.getElementById('errorAlert').style.display = 'block';
  setTimeout(hideErrorAlert, 5000); // Auto-hide after 5 seconds
}

function hideErrorAlert() {
  document.getElementById('errorAlert').style.display = 'none';
}

function showSuccessfulMessage(message) {
  // Show a message to the user that the story was submitted successfully under the submit button on the form
  const successMessage = document.createElement('div');
  successMessage.classList.add('alert', 'alert-success');
  successMessage.textContent = message;
  document.getElementById('form').appendChild(successMessage);
  setTimeout(() => successMessage.remove(), 5000); // Auto-hide after 5 seconds
}


async function loadAndDisplayLeaves() {
  try {
    const response = await fetch('stories.json'); // Adjust the path as necessary
    const leaves = await response.json();

    const container = document.querySelector('.leaf_test');

    // Define starting coordinates and fixed spacing
    const startX = 10; // Starting X percentage
    const startY = 8; // Starting Y percentage
    const spacingX = 30; // Horizontal spacing percentage between apples
    const spacingY = 40; // Vertical spacing percentage between apples
    const maxApplesPerLine = 3; // Maximum apples per line

    leaves.forEach((leaf, index) => {
      // Calculate current row and column based on index
      const row = Math.floor(index / maxApplesPerLine);
      const column = index % maxApplesPerLine;

      const currentX = startX + column * spacingX;
      const currentY = startY + row * spacingY;

      // Create the leaf group div
      const leafDiv = document.createElement('div');
      leafDiv.id = `story_${index}`;
      leafDiv.className = `leaf_group leaf_${index % 2 ? 1 : 2}`;
      leafDiv.style = `top:${currentY}%; left:${currentX}%; position: absolute;`;

      // Add name paragraph
      const nameP = document.createElement('p');
      nameP.className = 'name_on_leaf';
      nameP.textContent = leaf.name;
      leafDiv.appendChild(nameP);

      // Add content paragraph
      const contentP = document.createElement('p');
      contentP.className = 'story_on_leaf';

      contentP.innerHTML = leaf.content;
      if (leaf.image) { // Check if the image field exists
        const imgTag = `<img src="${leaf.image}" class="leaf_img" />`;
        contentP.innerHTML += imgTag; // Append the img tag only if image exists
      }
      leafDiv.dataset.title = leaf.title;
      leafDiv.appendChild(contentP);

      // Append the leaf to the container
      container.appendChild(leafDiv);
    });
  } catch (error) {
    console.error('Failed to load leaf data:', error);
  }
}