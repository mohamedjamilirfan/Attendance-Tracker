document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const toggleCheckbox = document.querySelectorAll('input')[0];
  const totalClassesInput = document.querySelectorAll('input')[1];
  const attendedClassesInput = document.querySelectorAll('input')[2];
  const requiredAttendanceInput = document.querySelectorAll('input')[3];
  const messageDiv = document.getElementById('congratulations-message');
  const body = document.body;
  const calculateButton = document.querySelectorAll('button')[0];
  const resetButton = document.querySelectorAll('button')[1];
  const percentageDisplay = document.getElementById('percentage');
  const progressBar = document.getElementById('progress');
  const classesMissedDisplay = document.getElementById('classes-missed');
  const classesNeededDisplay = document.getElementById('classes-needed');
  const resultDiv = document.getElementById('result');

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    toggleCheckbox.checked = false;
  }

  toggleCheckbox.addEventListener('change', () => {
    if (!toggleCheckbox.checked) {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  });

  // Create a tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);

  // Show tooltip on hover
  document.querySelectorAll('input[data-tooltip]').forEach((input) => {
    input.addEventListener('mouseenter', (event) => {
      const message = input.getAttribute('data-tooltip');
      tooltip.textContent = message;
      const rect = input.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX}px`;
      tooltip.style.top = `${rect.top + window.scrollY - 30}px`;
      tooltip.classList.add('show');
    });

    input.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });
  });

  // Popup function
  function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <p>${message}</p>
        <button class="close-popup">&times;</button>
    `;
    document.body.appendChild(popup);

    const closeButton = popup.querySelector('.close-popup');
    closeButton.addEventListener('click', () => {
      popup.remove();
    });

    setTimeout(() => {
      popup.remove();
    }, 5000); // Auto-close popup after 5 seconds
  }

  // Clear previous congratulatory message
  const clearCongratulatoryMessage = () => {
    const messageDiv = document.querySelector('.congratulations-message');
    if (messageDiv) {
      messageDiv.style.display = 'none';
    }
  };

  // Calculate function
  const calculateAttendance = () => {
    clearCongratulatoryMessage();

    const totalClasses = parseInt(totalClassesInput.value, 10);
    const attendedClasses = parseInt(attendedClassesInput.value, 10);
    const targetPercentage = parseInt(requiredAttendanceInput.value, 10);

    if (isNaN(totalClasses) || isNaN(attendedClasses) || totalClasses <= 0) {
      showPopup(
        'Please enter valid numbers for Total Classes and Classes Attended.'
      );
      return;
    }

    if (attendedClasses > totalClasses) {
      showPopup('Attended classes cannot be greater than total classes.');
      return;
    }

    const currentPercentage = (attendedClasses / totalClasses) * 100;

    // Calculate additional classes needed to meet target percentage
    let additionalClassesNeeded = 0;
    if (currentPercentage < targetPercentage) {
      additionalClassesNeeded = Math.ceil(
        (targetPercentage * totalClasses - 100 * attendedClasses) /
          (100 - targetPercentage)
      );
    }

    // Calculate total classes missed
    const classesMissed = totalClasses - attendedClasses;

    // Update results
    percentageDisplay.innerText = `${currentPercentage.toFixed(2)}%`;
    progressBar.style.width = `${currentPercentage}%`;
    classesMissedDisplay.innerText = classesMissed;
    classesNeededDisplay.innerText =
      additionalClassesNeeded > 0 ? additionalClassesNeeded : 0;

    // Congratulatory message for extra classes
    if (currentPercentage > targetPercentage) {
      const extraClasses = Math.floor(
        (attendedClasses * 100 - totalClasses * targetPercentage) /
          targetPercentage
      );
      const messageDiv = document.getElementById('congratulations-message');
      messageDiv.style.display = 'block';
      messageDiv.innerHTML = `🎉 Congratulations! You have extra ${extraClasses} classes you can skip while maintaining the required attendance percentage.`;
    } else {
      messageDiv.style.display = 'none';
    }

    // Scroll to the results section
    resultDiv.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset function
  const resetCalculator = () => {
    totalClassesInput.value = '';
    attendedClassesInput.value = '';
    requiredAttendanceInput.value = '';
    percentageDisplay.innerText = '0%';
    progressBar.style.width = '0%';
    classesMissedDisplay.innerText = '0';
    classesNeededDisplay.innerText = '0';
    messageDiv.style.display = 'none';
    clearCongratulatoryMessage();
  };

  // Handle "Enter" key navigation
  totalClassesInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      attendedClassesInput.focus();
    }
  });

  attendedClassesInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      requiredAttendanceInput.focus();
    }
  });

  requiredAttendanceInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Stop form submission and prevent accidental button press
      calculateButton.click(); // Trigger the calculation
    }
  });

  // Event listeners
  calculateButton.addEventListener('click', calculateAttendance);
  resetButton.addEventListener('click', resetCalculator);

  // Navigation bar visibility based on scroll
  let lastScrollTop = 0; // Tracks the last scroll position
  const navBar = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    const currentScroll =
      window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop && currentScroll > 50) {
      // User is scrolling down and has scrolled past 50px, hide the navbar
      navBar.style.transform = 'translateY(-100%)';
    } else {
      // User is scrolling up, show the navbar
      navBar.style.transform = 'translateY(0)';
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Avoid negative values
  });
});
