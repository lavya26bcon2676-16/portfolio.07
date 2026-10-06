/**
 * Alex.dev — First-Year CSE Student Portfolio
 * Interactive Functionality: Theme Switcher, In-Browser C Terminal,
 * Modals, Live DevPulse Sandbox, Recruiter Toolkit, and Contact Handlers.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initSkillTabs();
  initTerminalSimulator();
  initRecruiterToolkit();
  initModals();
  initDevPulseSandbox();
  initContactForm();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light) with LocalStorage
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or prefer dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }
}

/* ==========================================================================
   2. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (!mobileMenuBtn || !navMenu) return;

  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. Skills Filter Tabs
   ========================================================================== */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-tab');

      skillCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. In-Browser C Terminal Simulator
   ========================================================================== */
function initTerminalSimulator() {
  const terminalBody = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const terminalSubmitBtn = document.getElementById('terminalSubmitBtn');
  const cmdPills = document.querySelectorAll('.cmd-pill');

  if (!terminalBody || !terminalInput) return;

  // History buffer
  const commandHistory = [];
  let historyIndex = -1;

  // Clickable command pills
  cmdPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  // Enter key in input
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = terminalInput.value.trim();
      if (cmd) {
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        executeCommand(cmd);
        terminalInput.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex] || '';
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  if (terminalSubmitBtn) {
    terminalSubmitBtn.addEventListener('click', () => {
      const cmd = terminalInput.value.trim();
      if (cmd) {
        commandHistory.push(cmd);
        historyIndex = commandHistory.length;
        executeCommand(cmd);
        terminalInput.value = '';
      }
    });
  }

  function appendTerminal(html) {
    terminalBody.insertAdjacentHTML('beforeend', html);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const cmd = rawCmd.toLowerCase().trim();

    // Echo command line
    appendTerminal(`
      <div class="terminal-line output-block">
        <span class="prompt-user">alex@dev-machine</span>:<span class="prompt-path">~/c-projects</span>$ <span class="cmd-text">${escapeHtml(rawCmd)}</span>
      </div>
    `);

    // Handle commands
    if (cmd === 'clear') {
      terminalBody.innerHTML = `
        <div class="terminal-line system-msg">
          Terminal cleared. Type <span class="highlight">help</span> for commands.
        </div>
      `;
      return;
    }

    if (cmd === 'help') {
      appendTerminal(`
        <div class="terminal-line response">
Available Commands:
  cat about.txt          - Display candidate summary & mission
  ls                     - List C program files in workspace
  run binary_search.c    - Compile & execute binary search benchmark
  run memory_alloc.c     - Simulate pointer arithmetic & malloc/free
  run student_db.c       - Run CLI student record database program
  whoami                 - Display user credentials & status
  git status             - View current git branch & commit status
  clear                  - Clear the terminal screen
        </div>
      `);
      return;
    }

    if (cmd === 'cat about.txt') {
      appendTerminal(`
        <div class="terminal-line response">
=======================================================
STUDENT PROFILE: Alex Chen | 1st Year B.Tech CSE
TARGET: Software Development Internship (Summer/Fall 2026)
CORE FOCUS: C Programming, Web Development, AI Workflows
PHILOSOPHY: Understand low-level fundamentals, ship fast.
=======================================================
        </div>
      `);
      return;
    }

    if (cmd === 'ls') {
      appendTerminal(`
        <div class="terminal-line response">
-rw-r--r-- 1 alex alex  1.2K Oct  6 08:30 about.txt
-rwxr-xr-x 1 alex alex  3.4K Oct  6 08:35 binary_search.c
-rwxr-xr-x 1 alex alex  4.1K Oct  6 08:38 memory_alloc.c
-rwxr-xr-x 1 alex alex  5.8K Oct  6 08:42 student_db.c
-rw-r--r-- 1 alex alex   420 Oct  6 08:44 Makefile
        </div>
      `);
      return;
    }

    if (cmd === 'whoami') {
      appendTerminal(`
        <div class="terminal-line response">
alex (UID=1001, GID=1001) [First-Year Computer Science Undergraduate & Intern Candidate]
Status: Available for 2026 Internships
        </div>
      `);
      return;
    }

    if (cmd === 'git status') {
      appendTerminal(`
        <div class="terminal-line response">
On branch main
Your branch is up to date with 'origin/main'.
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   index.html
        modified:   styles.css
        modified:   script.js

nothing to commit, working tree clean (All commits signed and reviewed)
        </div>
      `);
      return;
    }

    if (cmd === 'run binary_search.c' || cmd === './binary_search') {
      appendTerminal(`
        <div class="terminal-line response">
[gcc -Wall -Wextra -O2 binary_search.c -o binary_search]
Compilation successful. Zero warnings.
Executing ./binary_search ...

--- C Binary Search Algorithm Demonstration ---
Input Array (Sorted, N=10): [ 4, 12, 19, 27, 35, 42, 58, 64, 79, 91 ]
Target value to find: 42

Step 1: Low = 0 (val: 4),  High = 9 (val: 91), Mid = 4 (val: 35) -> 42 > 35 (Search Right)
Step 2: Low = 5 (val: 42), High = 9 (val: 91), Mid = 7 (val: 64) -> 42 < 64 (Search Left)
Step 3: Low = 5 (val: 42), High = 6 (val: 58), Mid = 5 (val: 42) -> MATCH FOUND!

✓ Element 42 found at index [5].
✓ Time Complexity: O(log N) — 3 comparisons vs 6 in linear search.
        </div>
      `);
      return;
    }

    if (cmd === 'run memory_alloc.c' || cmd === './memory_alloc') {
      appendTerminal(`
        <div class="terminal-line response">
[gcc -Wall -Werror -fsanitize=address memory_alloc.c -o memory_alloc]
Compilation successful. AddressSanitizer enabled.
Executing ./memory_alloc ...

--- Dynamic Memory Allocation & Pointer Demonstration ---
1. Requesting heap memory: int* arr = (int*)malloc(5 * sizeof(int));
   Allocated 20 bytes on Heap at address: 0x7ffd8a201c40
2. Initializing values:
   arr[0] = 10 (Addr: 0x7ffd8a201c40)
   arr[1] = 20 (Addr: 0x7ffd8a201c44) [+4 bytes]
   arr[2] = 30 (Addr: 0x7ffd8a201c48) [+4 bytes]
   arr[3] = 40 (Addr: 0x7ffd8a201c4c) [+4 bytes]
   arr[4] = 50 (Addr: 0x7ffd8a201c50) [+4 bytes]
3. Pointer Arithmetic Verification:
   *(arr + 3) == 40: VERIFIED
4. Cleaning up heap: free(arr); arr = NULL;
   Memory safely freed. Zero memory leaks detected by Valgrind.
        </div>
      `);
      return;
    }

    if (cmd === 'run student_db.c' || cmd === './student_db') {
      appendTerminal(`
        <div class="terminal-line response">
[gcc -std=c11 -O2 student_db.c -o student_db]
Executing ./student_db ...

=== C CLI Student Records Registry ===
Loaded 3 records from binary buffer.
1. [ID: 202601] Alex Chen      | Major: CSE | GPA: 3.82 | Status: Seeking Internship
2. [ID: 202602] Jordan Smith   | Major: CSE | GPA: 3.65 | Status: Active
3. [ID: 202603] Taylor Reed    | Major: ECE | GPA: 3.74 | Status: Active

Running struct memory alignment test:
sizeof(struct Student) = 48 bytes (padded for 64-bit alignment)
All test assertions PASSED.
        </div>
      `);
      return;
    }

    // Default unknown command
    appendTerminal(`
      <div class="terminal-line response" style="color: #f87171;">
bash: command not found: ${escapeHtml(rawCmd)}.
Type <span class="highlight">help</span> to view available simulator commands.
      </div>
    `);
  }
}

/* ==========================================================================
   5. Recruiter Toolkit Tabs, Accordion & 1-Click Copy
   ========================================================================== */
function initRecruiterToolkit() {
  // Toolkit Tabs
  const toolkitTabBtns = document.querySelectorAll('.toolkit-tab-btn');
  const toolkitPanes = document.querySelectorAll('.toolkit-pane');

  toolkitTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toolkitTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tool = btn.getAttribute('data-tool');
      toolkitPanes.forEach(pane => {
        if (pane.id === `pane-${tool}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // Accordion inside Q&A
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });

  // 1-Click Cold Email Copy
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const coldEmailContent = document.getElementById('coldEmailContent');
  const copyBtnText = document.getElementById('copyEmailBtnText');

  if (copyEmailBtn && coldEmailContent) {
    copyEmailBtn.addEventListener('click', () => {
      const textToCopy = coldEmailContent.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        copyBtnText.textContent = '✓ Copied to Clipboard!';
        copyEmailBtn.style.background = 'var(--accent-emerald)';
        showToast('Cold email template copied to clipboard!');

        setTimeout(() => {
          copyBtnText.textContent = '📋 Copy Email Template';
          copyEmailBtn.style.background = '';
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy', err);
        showToast('Could not copy automatically. Please select text manually.');
      });
    });
  }
}

/* ==========================================================================
   6. Modals (DevPulse Demo & Resume)
   ========================================================================== */
function initModals() {
  // DevPulse Modal
  const devPulseModal = document.getElementById('devPulseModal');
  const launchDevPulseBtn = document.getElementById('launchDevPulseModal');
  const closeDevPulseBtn = document.getElementById('closeDevPulseModal');
  const closeModalFooterBtn = document.getElementById('closeModalFooterBtn');

  if (launchDevPulseBtn && devPulseModal) {
    launchDevPulseBtn.addEventListener('click', () => {
      devPulseModal.classList.add('open');
      devPulseModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Trigger initial sandbox render
      updateSandboxPreview();
    });
  }

  const closeDevPulse = () => {
    if (devPulseModal) {
      devPulseModal.classList.remove('open');
      devPulseModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (closeDevPulseBtn) closeDevPulseBtn.addEventListener('click', closeDevPulse);
  if (closeModalFooterBtn) closeModalFooterBtn.addEventListener('click', closeDevPulse);

  // Resume Modal
  const resumeModal = document.getElementById('resumeModal');
  const openResumeModalBtn = document.getElementById('openResumeModalBtn');
  const closeResumeModalBtn = document.getElementById('closeResumeModal');

  if (openResumeModalBtn && resumeModal) {
    openResumeModalBtn.addEventListener('click', () => {
      resumeModal.classList.add('open');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeResume = () => {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResume);

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === devPulseModal) closeDevPulse();
    if (e.target === resumeModal) closeResume();
  });

  // Close modals on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDevPulse();
      closeResume();
    }
  });
}

/* ==========================================================================
   7. DevPulse Sub-Apps (Live Code Sandbox, C Visualizer, Pomodoro Timer)
   ========================================================================== */
function initDevPulseSandbox() {
  // Demo Sub-Tabs
  const demoTabBtns = document.querySelectorAll('.demo-tab-btn');
  const demoPanes = document.querySelectorAll('.demo-pane');

  demoTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      demoTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetDemo = btn.getAttribute('data-demo');
      demoPanes.forEach(pane => {
        if (pane.id === `demo-${targetDemo}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // Sandbox Live Editor
  const sandboxTextarea = document.getElementById('sandboxHtml');
  if (sandboxTextarea) {
    sandboxTextarea.addEventListener('input', updateSandboxPreview);
  }

  // C Logic Visualizer Concepts
  const visPills = document.querySelectorAll('.vis-pill');
  const conceptDisplay = document.getElementById('conceptDisplay');

  const concepts = {
    pointers: `/* C Pointers & Memory Address Visualization */
int count = 42;
int *ptr = &count; // ptr holds memory address of count

Memory Map:
[ Variable ]     [ Address ]         [ Value ]
   count      ->  0x7ffd582a   ->     42
   ptr        ->  0x7ffd5830   ->     0x7ffd582a
*ptr dereferences to value: 42`,

    'binary-search': `/* Binary Search Visual State (Target: 27) */
Array: [ 5, 11, 18, 27, 34, 49, 62 ]
Index:   0   1   2   3   4   5   6
                     ^
Iter 1: Mid = (0+6)/2 = 3. Value at arr[3] = 27.
Match found on 1st iteration!
Total comparisons: 1. Time complexity: O(1) best / O(log N) avg.`,

    malloc: `/* malloc() and free() Lifecycle in C */
int *buffer = (int*)malloc(1024 * sizeof(int)); // 4096 bytes requested
if (buffer == NULL) {
    fprintf(stderr, "Heap allocation failed!\\n");
    return 1;
}
// Work with buffer...
free(buffer);    // Release heap memory back to OS
buffer = NULL;   // Prevent dangling pointer bug`
  };

  if (conceptDisplay) {
    conceptDisplay.textContent = concepts.pointers;
  }

  visPills.forEach(pill => {
    pill.addEventListener('click', () => {
      visPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const conceptKey = pill.getAttribute('data-concept');
      if (conceptDisplay && concepts[conceptKey]) {
        conceptDisplay.textContent = concepts[conceptKey];
      }
    });
  });

  // Pomodoro Focus Timer
  initPomodoroTimer();
}

function updateSandboxPreview() {
  const sandboxTextarea = document.getElementById('sandboxHtml');
  const sandboxPreview = document.getElementById('sandboxPreview');
  if (!sandboxTextarea || !sandboxPreview) return;

  const content = sandboxTextarea.value;
  const doc = sandboxPreview.contentDocument || sandboxPreview.contentWindow.document;
  doc.open();
  doc.write(content);
  doc.close();
}

function initPomodoroTimer() {
  const timerDisplay = document.getElementById('timerDisplay');
  const startTimerBtn = document.getElementById('startTimerBtn');
  const resetTimerBtn = document.getElementById('resetTimerBtn');
  const timerStatus = document.getElementById('timerStatus');

  if (!timerDisplay || !startTimerBtn || !resetTimerBtn) return;

  let totalSeconds = 25 * 60;
  let intervalId = null;
  let isRunning = false;

  function renderTimer() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  startTimerBtn.addEventListener('click', () => {
    if (!isRunning) {
      isRunning = true;
      startTimerBtn.textContent = 'Pause';
      timerStatus.textContent = '⚡ Deep focus session in progress...';
      intervalId = setInterval(() => {
        if (totalSeconds > 0) {
          totalSeconds--;
          renderTimer();
        } else {
          clearInterval(intervalId);
          isRunning = false;
          startTimerBtn.textContent = 'Start Timer';
          timerStatus.textContent = '🎉 Session completed! Take a 5-minute break.';
          showToast('Focus session completed!');
        }
      }, 1000);
    } else {
      clearInterval(intervalId);
      isRunning = false;
      startTimerBtn.textContent = 'Resume';
      timerStatus.textContent = 'Session paused';
    }
  });

  resetTimerBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    isRunning = false;
    totalSeconds = 25 * 60;
    renderTimer();
    startTimerBtn.textContent = 'Start Timer';
    timerStatus.textContent = 'Ready for deep work session';
  });
}

/* ==========================================================================
   8. Contact Form Handler & Toast Notifications
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formSuccessToast = document.getElementById('formSuccessToast');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const company = document.getElementById('company').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    // Build mailto link
    const subject = encodeURIComponent(`Internship Opportunity: ${company ? company + ' - ' : ''}${name}`);
    const body = encodeURIComponent(`Hi Alex,\n\n${message}\n\nFrom: ${name} (${email})\nCompany: ${company || 'N/A'}`);
    const mailtoUrl = `mailto:alex.chen.cs@example.com?subject=${subject}&body=${body}`;

    if (formSuccessToast) {
      formSuccessToast.classList.remove('hidden');
    }
    showToast('Message ready! Opening email client...');

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 800);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
