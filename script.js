/* ============================================
   ESSY'S CROCHET SHOP — Main JavaScript
   Features: Nav, Scroll Reveal, Gallery Filter,
             Blog Modal, Form Validation, Animations
   ============================================ */

// =============================================
// 1. NAVIGATION — Hamburger Menu Toggle
// =============================================
document.addEventListener('DOMContentLoaded', function () {

  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      // Animate hamburger bars into X
      hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // Highlight the active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // =============================================
  // 2. SCROLL REVEAL ANIMATION
  // =============================================
  // Adds a "visible" class to elements as they scroll into view
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // Stagger the reveal animation
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target); // Only animate once
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // =============================================
  // 3. GALLERY FILTER FUNCTIONALITY
  // =============================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems  = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const category = btn.getAttribute('data-filter'); // e.g. "hats", "bags", "all"

        // Update active button styling
        filterButtons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        // Show/hide gallery items based on their data-category attribute
        galleryItems.forEach(function (item) {
          const itemCategory = item.getAttribute('data-category');

          if (category === 'all' || itemCategory === category) {
            item.classList.remove('hidden');
            // Small animation on show
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = 'fadeUp 0.45s ease both';
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // =============================================
  // 4. BLOG "READ MORE" MODAL
  // =============================================
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  const modalOverlay    = document.getElementById('blogModal');
  const modalClose      = document.getElementById('modalClose');
  const modalTitle      = document.getElementById('modalTitle');
  const modalContent    = document.getElementById('modalContent');

  // Full blog post content for each article
  const blogPosts = {
    'post-1': {
      title: 'How to Crochet a Cozy Winter Beanie',
      content: `
        <p>Whether you're a complete beginner or just looking to try a new pattern, this cozy winter beanie is the perfect weekend project. It's warm, stretchy, and works up fast — usually in just a few hours!</p>
        <h4>Materials Needed</h4>
        <ul>
          <li>Bulky weight yarn (approx. 120 yards) in your favourite colour</li>
          <li>6.0mm crochet hook</li>
          <li>Yarn needle and scissors</li>
          <li>Stitch markers (optional but helpful!)</li>
        </ul>
        <h4>Pattern Notes</h4>
        <p>This hat is worked in the round from the top down. We'll be using magic rings, single crochet, and half double crochet stitches. The slouchy shape is achieved by working a few extra increase rounds at the brim.</p>
        <h4>Instructions</h4>
        <p><strong>Round 1:</strong> Start with a magic ring, chain 2, and work 10 half double crochets into the ring. Join with a slip stitch. (10 sts)</p>
        <p><strong>Round 2:</strong> Chain 2. 2 hdc in each stitch around. Join. (20 sts)</p>
        <p><strong>Rounds 3–14:</strong> Continue in rows of hdc without increasing until the hat measures your desired length. Try it on as you go — everyone's head is a little different!</p>
        <h4>Finishing</h4>
        <p>Fasten off and weave in your ends with a yarn needle. For an extra cozy touch, add a chunky pom-pom on top. You can make one with a fork or cardboard circle and a bit of leftover yarn.</p>
        <p>Tag me on Instagram when you finish yours — I'd love to see it! 🧶</p>
      `
    },
    'post-2': {
      title: 'Beginner\'s Guide to Choosing Crochet Yarn',
      content: `
        <p>Walking into a craft store for the first time can be overwhelming — there are hundreds of yarn types, weights, and fibres to choose from. Let me help you cut through the confusion!</p>
        <h4>Yarn Weight Matters</h4>
        <p>Yarn is categorised into weights from 0 (lace) to 7 (jumbo). For beginners, I always recommend starting with <strong>worsted weight (4)</strong> or <strong>bulky (5)</strong>. These are thicker and easier to see, making it simpler to count your stitches.</p>
        <h4>Fibre Types</h4>
        <ul>
          <li><strong>Acrylic</strong> — Affordable, easy to care for, great for beginners. Machine washable!</li>
          <li><strong>Cotton</strong> — Great for summer items and dish cloths. Less stretch, so a little trickier.</li>
          <li><strong>Wool</strong> — Warm and beautiful, but requires hand-washing. Best for advanced projects.</li>
          <li><strong>Blends</strong> — A mix of fibres that balances comfort, durability, and ease.</li>
        </ul>
        <h4>My Favourite Beginner Yarns</h4>
        <p>For absolute beginners, I love Lion Brand Pound of Love (acrylic, super soft) and Paintbox Simply DK (cotton blend). Both come in gorgeous colours and are very forgiving of beginner mistakes.</p>
        <h4>Pro Tip</h4>
        <p>Always buy a little more yarn than the pattern calls for. Dye lots can vary, and running out mid-project is a crocheter's worst nightmare! I usually add 10–15% extra to whatever the pattern suggests.</p>
      `
    },
    'post-3': {
      title: 'Crochet Self-Care: Making It a Mindful Practice',
      content: `
        <p>Crochet isn't just a craft — it's one of the most accessible mindfulness practices available. The rhythmic motion of working stitches can calm an anxious mind and bring you gently into the present moment.</p>
        <h4>The Science Behind It</h4>
        <p>Studies have shown that repetitive hand movements like knitting and crocheting activate the relaxation response in the nervous system, reducing cortisol levels and promoting feelings of calm and wellbeing. It's sometimes called "the new yoga" — and I have to agree!</p>
        <h4>Creating a Crochet Ritual</h4>
        <ul>
          <li>Set aside 20–30 minutes each day, ideally at the same time.</li>
          <li>Make yourself a warm drink — tea, cocoa, whatever you love.</li>
          <li>Choose a project that's just challenging enough, but not stressful.</li>
          <li>Put your phone on silent and let yourself just create.</li>
        </ul>
        <h4>Mindful Stitching Tips</h4>
        <p>Focus on the sensation of the yarn in your hands, the sound of the hook against each stitch, and the rhythm of your movements. When your mind wanders (it will!), gently bring it back to counting your stitches.</p>
        <h4>Community Matters</h4>
        <p>Joining a crochet circle — even an online one — adds a beautiful social element to your practice. There's something deeply comforting about making alongside others, sharing patterns, and celebrating each other's finished objects. 🌿</p>
      `
    }
  };

  // Open modal when "Read More" is clicked
  if (readMoreButtons.length > 0 && modalOverlay) {
    readMoreButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const postId  = btn.getAttribute('data-post');
        const post    = blogPosts[postId];

        if (post) {
          modalTitle.textContent  = post.title;
          modalContent.innerHTML  = post.content;
          modalOverlay.classList.add('open');
          document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
      });
    });

    // Close modal on overlay click or close button
    function closeModal() {
      modalOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);

    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // =============================================
  // 5. CONTACT FORM — Client-Side Validation
  // =============================================
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const message = document.getElementById('message');
      let valid     = true;

      // Clear previous error states
      [name, email, message].forEach(function (field) {
        field.style.borderColor = '';
      });

      // Simple validation checks
      if (!name.value.trim()) {
        name.style.borderColor = '#d4856a';
        valid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        email.style.borderColor = '#d4856a';
        valid = false;
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        message.style.borderColor = '#d4856a';
        valid = false;
      }

      if (!valid) {
        e.preventDefault(); // Stop form submission if invalid
        if (formMessage) {
          formMessage.className = 'form-message error';
          formMessage.textContent = 'Oops! Please fill in all fields correctly before sending.';
        }
      }
    });
  }

  // Helper: Basic email format check
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // =============================================
  // 6. PHP FORM REDIRECT — Read URL Status Params
  // After contact.php processes the form, it redirects
  // back here with ?status=success or ?status=error
  // =============================================
  const urlParams   = new URLSearchParams(window.location.search);
  const formStatus  = urlParams.get('status');
  const senderName  = urlParams.get('name');
  const formMsgBox  = document.getElementById('formMessage');

  if (formStatus && formMsgBox) {
    if (formStatus === 'success') {
      formMsgBox.className = 'form-message success';
      formMsgBox.textContent = senderName
        ? `Thank you, ${senderName}! 🧶 Your message has been sent. I'll reply within 24 hours.`
        : 'Thank you! Your message has been sent. I\'ll reply within 24 hours.';
      // Scroll smoothly to the form feedback message
      formMsgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (formStatus === 'error') {
      formMsgBox.className = 'form-message error';
      formMsgBox.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
      formMsgBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Clean up the URL so it looks tidy (removes ?status=... from the address bar)
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // =============================================
  // 7. HERO WELCOME ANIMATION (Home Page)
  // =============================================
  const heroBtn = document.getElementById('heroShopBtn');

  if (heroBtn) {
    heroBtn.addEventListener('click', function () {
      // Small celebration burst on click
      heroBtn.textContent = '✨ Let\'s Go!';
      heroBtn.style.transform = 'scale(1.08)';
      setTimeout(function () {
        heroBtn.style.transform = '';
      }, 300);
    });
  }

  // =============================================
  // 7. SMOOTH SCROLL for anchor links
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =============================================
  // 8. NAVBAR — Add shadow on scroll
  // =============================================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 30) {
        navbar.style.boxShadow = '0 4px 24px rgba(122, 79, 58, 0.22)';
      } else {
        navbar.style.boxShadow = '0 2px 20px rgba(122, 79, 58, 0.15)';
      }
    });
  }

}); // End DOMContentLoaded
