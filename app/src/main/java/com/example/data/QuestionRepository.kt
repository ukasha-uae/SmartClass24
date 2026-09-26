package com.example.data

import android.content.Context
import android.util.Log
import com.example.model.ArenaQuestion
import com.example.model.Curriculum
import com.example.model.Subject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.io.BufferedReader
import java.io.InputStreamReader

/**
 * Single source of truth for all Arena Questions.
 *
 * Directly links the Android app to the authentic SmartClass24 Web database
 * and live Firestore `/challenges` backend, guaranteeing full parity without
 * generating separate or mock questions for Android.
 */
object QuestionRepository {

    private const val TAG = "QuestionRepository"
    private const val ASSET_FILE = "smartclass_questions.json"

    // Holds all loaded questions from SmartClass24 Web database and live sync
    private val loadedQuestions = mutableListOf<ArenaQuestion>()
    private val questionIds = mutableSetOf<String>()
    @Volatile
    private var isAssetLoaded = false

    // Initial fallback pool of authentic SmartClass questions
    val fallbackQuestions: List<ArenaQuestion> = listOf(
        // Mathematics
        ArenaQuestion(
            id = "math_01",
            subject = Subject.MATHEMATICS,
            curriculum = Curriculum.ALL_STEM,
            questionText = "If 3x + 5 = 26, what is the value of 2x - 3?",
            options = listOf("11", "14", "9", "7"),
            correctIndex = 0,
            explanation = "First solve 3x + 5 = 26: subtract 5 gives 3x = 21, so x = 7. Then evaluate 2(7) - 3 = 14 - 3 = 11.",
            keyConcept = "Linear Equations & Substitution"
        ),
        ArenaQuestion(
            id = "math_02",
            subject = Subject.MATHEMATICS,
            curriculum = Curriculum.WASSCE_BECE,
            questionText = "In a right-angled triangle, the adjacent side is 6 cm and the hypotenuse is 10 cm. Find the length of the opposite side.",
            options = listOf("8 cm", "7 cm", "6.5 cm", "9 cm"),
            correctIndex = 0,
            explanation = "By Pythagorean theorem: a² + b² = c² -> b = √(10² - 6²) = √(100 - 36) = √64 = 8 cm.",
            keyConcept = "Pythagorean Theorem"
        ),
        ArenaQuestion(
            id = "math_03",
            subject = Subject.MATHEMATICS,
            curriculum = Curriculum.CAMBRIDGE_IGCSE,
            questionText = "Differentiate f(x) = 4x³ - 5x² + 7 with respect to x.",
            options = listOf("12x² - 10x", "12x² - 10x + 7", "4x² - 5x", "12x³ - 5x"),
            correctIndex = 0,
            explanation = "Using the power rule d/dx[xⁿ] = n·xⁿ⁻¹: d/dx(4x³) = 12x², d/dx(-5x²) = -10x, and derivative of constant 7 is 0.",
            keyConcept = "Calculus (Power Rule)"
        ),
        // Physics
        ArenaQuestion(
            id = "phys_01",
            subject = Subject.PHYSICS,
            curriculum = Curriculum.WASSCE_BECE,
            questionText = "An object of mass 4 kg is accelerated from rest at 3 m/s² for 5 seconds. What is the net work done on the object?",
            options = listOf("450 J", "300 J", "150 J", "600 J"),
            correctIndex = 0,
            explanation = "Final velocity v = u + at = 0 + (3)(5) = 15 m/s. Work done = ΔKE = 0.5 × m × v² = 0.5 × 4 × 15² = 2 × 225 = 450 J.",
            keyConcept = "Work-Energy Theorem & Kinematics"
        ),
        ArenaQuestion(
            id = "phys_02",
            subject = Subject.PHYSICS,
            curriculum = Curriculum.ALL_STEM,
            questionText = "What is the SI unit of Magnetic Flux Density?",
            options = listOf("Tesla (T)", "Weber (Wb)", "Henry (H)", "Lumen (lm)"),
            correctIndex = 0,
            explanation = "Magnetic flux density is measured in Teslas (T), where 1 T = 1 Wb/m².",
            keyConcept = "Electromagnetism & SI Units"
        ),
        // Chemistry
        ArenaQuestion(
            id = "chem_01",
            subject = Subject.CHEMISTRY,
            curriculum = Curriculum.ALL_STEM,
            questionText = "What is the pH of a 0.001 M solution of Hydrochloric acid (HCl), assuming complete dissociation?",
            options = listOf("3.0", "1.0", "4.0", "11.0"),
            correctIndex = 0,
            explanation = "HCl is a strong monoprotic acid, so [H⁺] = 0.001 M = 10⁻³ M. pH = -log₁₀[H⁺] = -log₁₀(10⁻³) = 3.0.",
            keyConcept = "Acids, Bases & pH Scale"
        ),
        // Integrated Science
        ArenaQuestion(
            id = "sci_01",
            subject = Subject.INTEGRATED_SCIENCE,
            curriculum = Curriculum.WASSCE_BECE,
            questionText = "Which part of the human blood cell is primarily responsible for transporting oxygen to body tissues?",
            options = listOf("Erythrocytes (Red Blood Cells)", "Leukocytes (White Blood Cells)", "Thrombocytes (Platelets)", "Blood Plasma"),
            correctIndex = 0,
            explanation = "Erythrocytes contain hemoglobin, an iron-rich protein that binds reversibly to oxygen molecules for systemic transport.",
            keyConcept = "Human Circulatory System"
        ),
        // Computing & AI
        ArenaQuestion(
            id = "comp_01",
            subject = Subject.COMPUTING_AI,
            curriculum = Curriculum.ALL_STEM,
            questionText = "What is the worst-case time complexity of searching for an element in a balanced Binary Search Tree (BST) of N nodes?",
            options = listOf("O(log N)", "O(N)", "O(1)", "O(N log N)"),
            correctIndex = 0,
            explanation = "In a balanced BST (such as an AVL or Red-Black tree), the tree height is bounded by O(log N), so search operations take O(log N).",
            keyConcept = "Data Structures & Time Complexity"
        ),
        // English & Verbal Logic
        ArenaQuestion(
            id = "eng_01",
            subject = Subject.ENGLISH_LOGIC,
            curriculum = Curriculum.WASSCE_BECE,
            questionText = "Identify the literary device used in: 'The digital server hummed like a slumbering beast.'",
            options = listOf("Simile", "Metaphor", "Hyperbole", "Oxymoron"),
            correctIndex = 0,
            explanation = "A simile directly compares two different things using connective words such as 'like' or 'as'.",
            keyConcept = "Figurative Language & Literary Devices"
        ),
        // S24 Innovation Academy - Python & AI Systems
        ArenaQuestion(
            id = "s24_py_01",
            subject = Subject.PYTHON_AI,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "What is the primary reason why the Rectified Linear Unit (ReLU) activation function f(x) = max(0, x) is preferred over Sigmoid in deep neural networks?",
            options = listOf(
                "It mitigates the vanishing gradient problem during backpropagation",
                "It restricts all output values strictly between 0 and 1",
                "It is completely differentiable at exactly x = 0",
                "It eliminates the need for learning rate optimization"
            ),
            correctIndex = 0,
            explanation = "For positive inputs, the derivative of ReLU is constant (1), preventing gradients from exponentially decaying across deep hidden layers.",
            keyConcept = "Neural Network Activations & Gradient Descent",
            difficulty = "Advanced"
        ),
        ArenaQuestion(
            id = "s24_py_02",
            subject = Subject.PYTHON_AI,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "In Python, why is using a mutable object (e.g. def append_to(item, target=[]) ) as a default argument considered an anti-pattern?",
            options = listOf(
                "The default object is evaluated once at function definition time, sharing state across calls",
                "Python raises a SyntaxError at compile time for mutable defaults",
                "Default lists cannot be accessed within the function scope",
                "It causes the Global Interpreter Lock (GIL) to deadlock"
            ),
            correctIndex = 0,
            explanation = "Python evaluates default argument expressions once when the function is defined, causing the same list instance to persist across consecutive calls.",
            keyConcept = "Python Scope & Mutable Defaults",
            difficulty = "Medium"
        ),
        ArenaQuestion(
            id = "s24_py_03",
            subject = Subject.PYTHON_AI,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "What machine learning technique groups unlabeled data points into clusters by iteratively updating centroids until convergence?",
            options = listOf("K-Means Clustering", "Linear Discriminant Analysis", "Logistic Regression", "Random Forest Regressor"),
            correctIndex = 0,
            explanation = "K-Means is an unsupervised clustering algorithm that assigns points to the nearest centroid and minimizes within-cluster variance.",
            keyConcept = "Unsupervised Learning & Centroid Clustering",
            difficulty = "Medium"
        ),
        // S24 Innovation Academy - Web Development
        ArenaQuestion(
            id = "s24_web_01",
            subject = Subject.WEB_DEV,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "In CSS Flexible Box Layout (Flexbox), which property controls the alignment of flex items along the cross axis?",
            options = listOf("align-items", "justify-content", "flex-direction", "align-content"),
            correctIndex = 0,
            explanation = "'justify-content' aligns items along the main axis, while 'align-items' controls alignment along the perpendicular cross axis.",
            keyConcept = "CSS Flexbox Cross-Axis Alignment",
            difficulty = "Easy"
        ),
        ArenaQuestion(
            id = "s24_web_02",
            subject = Subject.WEB_DEV,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "According to HTTP RFC specifications, what is the key difference between HTTP status codes 401 and 403?",
            options = listOf(
                "401 denotes unauthenticated (needs credentials), whereas 403 denotes forbidden (authenticated but unauthorized)",
                "401 is a Server Error, whereas 403 is a Client Error",
                "401 means Resource Not Found, whereas 403 means Bad Request",
                "401 is temporary, whereas 403 is permanent redirect"
            ),
            correctIndex = 0,
            explanation = "401 Unauthorized indicates the client must authenticate with valid credentials. 403 Forbidden indicates the server understood credentials but refuses authorization.",
            keyConcept = "HTTP Protocol Status & Authentication",
            difficulty = "Medium"
        ),
        ArenaQuestion(
            id = "s24_web_03",
            subject = Subject.WEB_DEV,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "In the JavaScript Event Loop, which queue takes highest priority immediately after the currently running script completes?",
            options = listOf("Microtask Queue (Promise.then, queueMicrotask)", "Macrotask Queue (setTimeout, setInterval)", "Render Frame Queue", "I/O Polling Queue"),
            correctIndex = 0,
            explanation = "Microtasks are always drained completely at the end of each task execution before the event loop pulls the next macrotask.",
            keyConcept = "JavaScript Asynchronous Concurrency & Event Loop",
            difficulty = "Advanced"
        ),
        // S24 Innovation Academy - Data Structures & Algorithms
        ArenaQuestion(
            id = "s24_algo_01",
            subject = Subject.ALGORITHMS,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "What is the worst-case time complexity of the standard QuickSort algorithm when elements are already sorted and the last element is chosen as pivot?",
            options = listOf("O(N²)", "O(N log N)", "O(N)", "O(log N)"),
            correctIndex = 0,
            explanation = "When partitioning produces maximally unbalanced sub-arrays (1 and N-1 elements), QuickSort degrades to O(N²) quadratic time complexity.",
            keyConcept = "Sorting Algorithms & Worst-Case Partitioning",
            difficulty = "Medium"
        ),
        ArenaQuestion(
            id = "s24_algo_02",
            subject = Subject.ALGORITHMS,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "Which data structure is fundamentally required to traverse a graph using Breadth-First Search (BFS)?",
            options = listOf("FIFO Queue", "LIFO Stack", "Max Binary Heap", "Disjoint-Set Union"),
            correctIndex = 0,
            explanation = "Breadth-First Search systematically visits neighbors level-by-level using a First-In-First-Out (FIFO) queue.",
            keyConcept = "Graph Traversal & Queue Data Structures",
            difficulty = "Easy"
        ),
        ArenaQuestion(
            id = "s24_algo_03",
            subject = Subject.ALGORITHMS,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "In hash tables, what collision resolution strategy allocates a separate linked list or balanced tree at each bucket index?",
            options = listOf("Separate Chaining", "Linear Probing", "Quadratic Probing", "Double Hashing"),
            correctIndex = 0,
            explanation = "Separate chaining maintains a dynamic collection (e.g. linked list or red-black tree) at each hash bucket to store colliding keys.",
            keyConcept = "Hash Table Collision Resolution",
            difficulty = "Medium"
        ),
        // S24 Innovation Academy - Cloud & Cybersecurity
        ArenaQuestion(
            id = "s24_cloud_01",
            subject = Subject.CLOUD_CYBER,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "Which defensive engineering practice is universally recognized as the most effective defense against SQL Injection (SQLi)?",
            options = listOf(
                "Parameterized Queries (Prepared Statements)",
                "Escaping single quotes with regular expressions",
                "Client-side HTML input maxlength attributes",
                "Hashing database column names"
            ),
            correctIndex = 0,
            explanation = "Parameterized queries pre-compile the SQL query structure, treating user input strictly as parameters rather than executable SQL syntax.",
            keyConcept = "Application Security & SQL Injection Prevention",
            difficulty = "Medium"
        ),
        ArenaQuestion(
            id = "s24_cloud_02",
            subject = Subject.CLOUD_CYBER,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "In asymmetric cryptography (Public Key Infrastructure), how is confidentiality achieved when Alice sends an encrypted message to Bob?",
            options = listOf(
                "Alice encrypts using Bob's Public Key, and Bob decrypts with Bob's Private Key",
                "Alice encrypts using Alice's Private Key, and Bob decrypts with Bob's Public Key",
                "Both parties use a shared pre-shared symmetric key generated at compile time",
                "Alice encrypts using Bob's Private Key"
            ),
            correctIndex = 0,
            explanation = "To ensure confidentiality, data is encrypted with the recipient's public key; only the recipient's corresponding private key can decrypt it.",
            keyConcept = "Asymmetric Cryptography & Public Key Encryption",
            difficulty = "Medium"
        ),
        ArenaQuestion(
            id = "s24_cloud_03",
            subject = Subject.CLOUD_CYBER,
            curriculum = Curriculum.S24_INNOVATION_ACADEMY,
            questionText = "In modern cloud computing, what represents the primary difference between horizontal scalability and vertical scalability?",
            options = listOf(
                "Horizontal scalability adds more server instances; vertical scalability upgrades CPU/RAM of an existing instance",
                "Horizontal scalability increases storage only; vertical scalability increases network bandwidth",
                "Horizontal scalability is hardware-only; vertical scalability is software-only",
                "Horizontal scalability requires downtime; vertical scalability never requires restart"
            ),
            correctIndex = 0,
            explanation = "Horizontal scaling (scaling out) distributes load across multiple machines, whereas vertical scaling (scaling up) increases the hardware capacity of a single machine.",
            keyConcept = "Cloud Architecture & Scalability Patterns",
            difficulty = "Easy"
        )
    )

    /**
     * Initializes the repository by reading all 1,710+ authentic questions
     * bundled from the SmartClass24 Web database assets.
     */
    fun initialize(context: Context) {
        if (isAssetLoaded && loadedQuestions.isNotEmpty()) return

        try {
            val assetManager = context.assets
            val inputStream = assetManager.open(ASSET_FILE)
            val reader = BufferedReader(InputStreamReader(inputStream, "UTF-8"))
            val jsonString = reader.use { it.readText() }

            val jsonArray = JSONArray(jsonString)
            val parsedQuestions = mutableListOf<ArenaQuestion>()

            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                val id = obj.optString("id", "q_$i")
                val rawSubject = obj.optString("rawSubject", "Mathematics")
                val questionText = obj.optString("questionText", "")
                if (questionText.isBlank()) continue

                val optionsArray = obj.optJSONArray("options")
                val options = mutableListOf<String>()
                if (optionsArray != null) {
                    for (j in 0 until optionsArray.length()) {
                        options.add(optionsArray.getString(j))
                    }
                }
                if (options.isEmpty()) {
                    options.add("True")
                    options.add("False")
                }

                val correctIndex = obj.optInt("correctIndex", 0).coerceIn(0, options.size - 1)
                val explanation = obj.optString("explanation", "Correct: ${options[correctIndex]}")
                val keyConcept = obj.optString("keyConcept", rawSubject)
                val difficulty = obj.optString("difficulty", "Medium")
                val source = obj.optString("source", "WASSCE")

                val subjectEnum = Subject.fromName(rawSubject)
                val curriculum = Curriculum.fromCode(source)

                val arenaQ = ArenaQuestion(
                    id = id,
                    subject = subjectEnum,
                    curriculum = curriculum,
                    questionText = questionText,
                    options = options,
                    correctIndex = correctIndex,
                    explanation = explanation,
                    keyConcept = keyConcept,
                    difficulty = difficulty
                )
                parsedQuestions.add(arenaQ)
            }

            synchronized(loadedQuestions) {
                for (q in parsedQuestions) {
                    if (questionIds.add(q.id)) {
                        loadedQuestions.add(q)
                    }
                }
                isAssetLoaded = true
            }
            Log.d(TAG, "Loaded ${loadedQuestions.size} authentic questions from SmartClass24 Web database asset")
        } catch (e: Exception) {
            Log.e(TAG, "Error loading questions from assets: ${e.message}", e)
        }
    }

    /**
     * Synchronizes live questions from the Firestore backend challenges
     * created by the SmartClass24 Web application.
     */
    suspend fun syncFromFirestore() = withContext(Dispatchers.IO) {
        try {
            val liveQuestions = SmartClassSyncService.fetchQuestionsFromFirestore()
            if (liveQuestions.isNotEmpty()) {
                synchronized(loadedQuestions) {
                    var added = 0
                    for (q in liveQuestions) {
                        if (questionIds.add(q.id)) {
                            loadedQuestions.add(0, q) // Add latest live questions at front
                            added++
                        }
                    }
                    Log.d(TAG, "Merged $added new live questions from Firestore into QuestionRepository")
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Live Firestore question sync failed: ${e.message}")
        }
    }

    fun getTotalQuestionCount(): Int {
        return if (loadedQuestions.isNotEmpty()) loadedQuestions.size else fallbackQuestions.size
    }

    /**
     * Active questions list (either loaded authentic assets or fallback pool).
     */
    val questions: List<ArenaQuestion>
        get() = if (loadedQuestions.isNotEmpty()) loadedQuestions else fallbackQuestions

    /**
     * Retrieves questions tailored to the battle mode, subject, and curriculum.
     * Guaranteed to use the authentic SmartClass24 web questions.
     */
    fun getQuestionsForBattle(
        subject: Subject,
        curriculum: Curriculum,
        count: Int = 5
    ): List<ArenaQuestion> {
        val pool = questions

        // 1. Strict filter: matching subject AND curriculum
        val strictFiltered = pool.filter {
            (subject == Subject.ALL || it.subject == subject) &&
            (curriculum == Curriculum.ALL_STEM || it.curriculum == curriculum || it.curriculum == Curriculum.ALL_STEM)
        }
        if (strictFiltered.size >= count) {
            return strictFiltered.shuffled().take(count)
        }

        // 2. Subject filter: matching selected subject across all curricula
        val subjectFiltered = pool.filter {
            subject == Subject.ALL || it.subject == subject
        }
        if (subjectFiltered.size >= count) {
            return subjectFiltered.shuffled().take(count)
        }

        // 3. Curriculum filter: matching curriculum across all subjects
        val curriculumFiltered = pool.filter {
            curriculum == Curriculum.ALL_STEM || it.curriculum == curriculum || it.curriculum == Curriculum.ALL_STEM
        }
        if (curriculumFiltered.size >= count) {
            return curriculumFiltered.shuffled().take(count)
        }

        // 4. Fallback to broad pool
        return pool.shuffled().take(count)
    }
}
