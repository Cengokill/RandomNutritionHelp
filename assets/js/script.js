
document.addEventListener("DOMContentLoaded", function() {

    // --- Logique du Carrousel / Slider ---
    let slideIndex = 0;
    const slider = document.getElementById("slider");
    const slides = document.querySelectorAll("#slider img");
    const dotsContainer = document.querySelector(".dots");
    let slideInterval;
    const slideDuration = 5000; // 5 secondes

    function createDots() {
      dotsContainer.innerHTML = ''; // Vider les anciens points
       if (!slides || slides.length <= 1) {
          dotsContainer.style.display = 'none'; // Cache les points si 0 ou 1 slide
          return;
       }
       dotsContainer.style.display = 'flex'; // Affiche les points si > 1 slide
      slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        dot.setAttribute("onclick", `currentSlide(${i})`); // Attention: n-1 n'est plus nécessaire
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll(".dot");
         if (!dots || dots.length === 0) return;
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === slideIndex);
      });
    }

    function showSlide(index) {
        if (!slides || slides.length === 0) return; // Ne rien faire s'il n'y a pas de slides

      if (index >= slides.length) {
        slideIndex = 0;
      } else if (index < 0) {
        slideIndex = slides.length - 1;
      } else {
        slideIndex = index;
      }
       // Le calcul de la transformation change car chaque image fait 20% de la largeur de #slider
       const slideWidthPercentage = 100 / slides.length;
       slider.style.transform = `translateX(-${slideIndex * slideWidthPercentage}%)`;
      updateDots();
    }

    function nextSlide() {
      showSlide(slideIndex + 1);
    }

    function startSlider() {
       if (!slides || slides.length <= 1) return; // Ne pas démarrer si 0 ou 1 slide
      clearInterval(slideInterval); // Arrêter l'intervalle précédent
      slideInterval = setInterval(nextSlide, slideDuration);
    }

     // Fonction pour changer de slide manuellement (appelée par les points)
     // Doit être globale ou attachée à window si appelée via `onclick` HTML
     window.currentSlide = function(n) {
         if (!slides || slides.length <= 1) return;
        clearInterval(slideInterval);
        showSlide(n); // n est directement l'index (0-based)
        startSlider(); // Redémarrer le timer après clic manuel
     }

    // Initialisation du slider
    createDots();
    showSlide(slideIndex); // Afficher la première slide
    startSlider(); // Démarrer le défilement automatique

    // --- Logique d'Animation au Défilement ---
    const scrollElements = document.querySelectorAll(".animate-on-scroll");

    const elementInView = (el, dividend = 1) => {
      const elementTop = el.getBoundingClientRect().top;
      // Déclenche un peu avant que l'élément soit complètement visible
      return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
      );
    };

    const displayScrollElement = (element) => {
      element.classList.add("is-visible");
    };

    const hideScrollElement = (element) => {
      element.classList.remove("is-visible"); // Optionnel: pour ré-animer si on remonte
    };

    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 1.15)) { // Déclenche quand 15% du bas de l'élément est visible
          displayScrollElement(el);
        }
         // else { // Optionnel: décommenter pour cacher quand ça sort de la vue par le haut
         //   hideScrollElement(el);
         // }
      });
    }

    // Écouteur d'événement pour le défilement
    window.addEventListener("scroll", handleScrollAnimation);
    // Appel initial pour vérifier les éléments déjà visibles au chargement
    handleScrollAnimation();

    // Mise à jour de l'année dans le footer
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }


    // --- Logique du Lien de Téléchargement Conditionnel ---
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const navElement = document.querySelector("nav");
    let downloadLink = null;

    // !! IMPORTANT !! Remplacez par vos vrais liens App Store et Play Store
    const appStoreUrl = "https://apps.apple.com/VOTRE_LIEN_APP_STORE";
    const playStoreUrl = "https://play.google.com/store/apps/details?id=VOTRE_ID_APPLICATION";

    // Détection iOS (iPhone, iPad, iPod)
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      downloadLink = document.createElement("a");
      downloadLink.href = appStoreUrl;
      downloadLink.textContent = "Télécharger sur l'App Store";
      downloadLink.id = "download-app-link"; // ID pour un style spécifique si besoin
      downloadLink.target = "_blank"; // Ouvre dans un nouvel onglet/store
      downloadLink.rel = "noopener noreferrer";
    }
    // Détection Android
    else if (/android/i.test(userAgent)) {
      downloadLink = document.createElement("a");
      downloadLink.href = playStoreUrl;
      downloadLink.textContent = "Disponible sur Google Play";
      downloadLink.id = "download-app-link"; // ID pour un style spécifique si besoin
      downloadLink.target = "_blank"; // Ouvre dans un nouvel onglet/store
      downloadLink.rel = "noopener noreferrer";
    }

    // Ajouter le lien à la navigation s'il a été créé
    if (downloadLink && navElement) {
      // Ajouter un style spécifique au lien de téléchargement si besoin
      // downloadLink.style.fontWeight = 'bold';
      // downloadLink.style.marginLeft = '15px';
      // etc.
      // Ou utiliser l'ID #download-app-link dans le CSS

      navElement.appendChild(downloadLink);
    }

  }); // Fin de DOMContentLoaded