<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pin Plan 2.0 - Fitness Cycle Tracker</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #0ea5e9;
            --secondary: #fbbf24;
            --accent: #06b6d4;
            --dark: #0f172a;
            --dark-light: #1e293b;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, var(--dark) 0%, #1a1f35 100%);
            color: #fff;
            min-height: 100vh;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--dark-light);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--primary);
            border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent);
        }

        /* MODERN HEADER */
        header {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(51, 65, 85, 0.5);
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .header-content {
            max-width: 1400px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 2rem;
        }

        /* LOGO */
        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 1.5rem;
            font-weight: 900;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            min-width: fit-content;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: #fff;
            font-size: 1.2rem;
        }

        /* NAVIGATION */
        .nav-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .nav-btn {
            padding: 0.65rem 1.4rem;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            background: transparent;
            color: #cbd5e1;
            position: relative;
            overflow: hidden;
        }

        .nav-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: rgba(14, 165, 233, 0.1);
            transition: left 0.3s ease;
            z-index: -1;
        }

        .nav-btn:hover {
            color: #fff;
        }

        .nav-btn:hover::before {
            left: 0;
        }

        .nav-btn.active {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: var(--dark);
            box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        /* MAIN CONTAINER */
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        .section {
            display: none;
        }

        .section.active {
            display: block;
            animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* HERO SECTION */
        .hero {
            background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(6, 182, 212, 0.1));
            border: 1px solid rgba(14, 165, 233, 0.3);
            border-radius: 20px;
            padding: 3rem;
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -50%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(14, 165, 233, 0.1), transparent);
            border-radius: 50%;
            pointer-events: none;
        }

        .hero:hover {
            border-color: rgba(14, 165, 233, 0.5);
            box-shadow: 0 0 30px rgba(14, 165, 233, 0.2);
        }

        .hero h1 {
            font-size: 3rem;
            font-weight: 900;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--primary), var(--accent), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -1px;
        }

        .hero p {
            font-size: 1.2rem;
            color: #cbd5e1;
            margin-bottom: 2rem;
            max-width: 600px;
            line-height: 1.6;
        }

        .btn-primary {
            padding: 1rem 2rem;
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: var(--dark);
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
        }

        .btn-secondary {
            padding: 0.75rem 1.5rem;
            background: transparent;
            color: var(--primary);
            border: 2px solid var(--primary);
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            background: var(--primary);
            color: var(--dark);
        }

        /* STATS GRID */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .stat-card {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
            border: 1px solid #334155;
            border-radius: 16px;
            padding: 1.5rem;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s;
            pointer-events: none;
        }

        .stat-card:hover {
            border-color: var(--primary);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
        }

        .stat-card:hover::before {
            left: 100%;
        }

        .stat-label {
            color: #94a3b8;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }

        .stat-value {
            font-size: 2.5rem;
            font-weight: 900;
            margin-bottom: 0.25rem;
        }

        .stat-unit {
            color: #64748b;
            font-size: 0.9rem;
        }

        /* FORM STYLES */
        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #e2e8f0;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            background: var(--dark-light);
            border: 1px solid #475569;
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
            transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 10px rgba(14, 165, 233, 0.3);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .grid-2 {
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }

        .card {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5));
            border: 1px solid #334155;
            border-radius: 16px;
            padding: 2rem;
            transition: all 0.3s ease;
        }

        .card:hover {
            border-color: var(--primary);
            box-shadow: 0 10px 30px rgba(14, 165, 233, 0.1);
        }

        .card h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .chart-container {
            position: relative;
            height: 300px;
            margin: 1.5rem 0;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }

        .table th {
            background: rgba(14, 165, 233, 0.1);
            border-bottom: 2px solid var(--primary);
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }

        .table td {
            padding: 1rem;
            border-bottom: 1px solid #334155;
        }

        .table tr:hover {
            background: rgba(14, 165, 233, 0.05);
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        .modal.active {
            display: flex;
            animation: fadeIn 0.3s ease-in-out;
        }

        .modal-content {
            background: linear-gradient(135deg, var(--dark-light), var(--dark));
            border: 1px solid var(--primary);
            border-radius: 20px;
            padding: 2rem;
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            color: #fff;
        }

        .modal-footer {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }

        .modal-footer button {
            flex: 1;
        }

        .badge {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            background: rgba(14, 165, 233, 0.2);
            color: var(--primary);
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
        }

        .badge.success {
            background: rgba(16, 185, 129, 0.2);
            color: var(--success);
        }

        .badge.warning {
            background: rgba(245, 158, 11, 0.2);
            color: var(--warning);
        }

        .badge.danger {
            background: rgba(239, 68, 68, 0.2);
            color: var(--danger);
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }

            .hero {
                padding: 2rem 1.5rem;
            }

            .hero h1 {
                font-size: 2rem;
            }

            .stats-grid {
                grid-template-columns: 1fr;
            }

            .grid-2 {
                grid-template-columns: 1fr;
            }

            .header-content {
                flex-direction: column;
                gap: 1rem;
            }

            .nav-buttons {
                width: 100%;
                justify-content: space-between;
            }

            .nav-btn {
                flex: 1;
                padding: 0.5rem 0.75rem;
                font-size: 0.85rem;
            }

            .modal-content {
                padding: 1.5rem;
            }
        }

        .progress-bar {
            width: 100%;
            height: 8px;
            background: #334155;
            border-radius: 10px;
            overflow: hidden;
            margin: 0.5rem 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            border-radius: 10px;
            transition: width 0.3s ease;
        }

        .icon-btn {
            background: transparent;
            border: none;
            color: #cbd5e1;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 6px;
            transition: all 0.2s ease;
            font-size: 1.2rem;
        }

        .icon-btn:hover {
            background: rgba(14, 165, 233, 0.1);
            color: var(--primary);
        }

        .text-danger { color: var(--danger); }
        .text-success { color: var(--success); }
        .text-warning { color: var(--warning); }
        .text-primary { color: var(--primary); }

        .insight-card {
            background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(14, 165, 233, 0.05));
            border-left: 4px solid var(--secondary);
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1rem 0;
        }

        .insight-title {
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--secondary);
        }

        .insight-text {
            color: #cbd5e1;
            font-size: 0.95rem;
        }

        .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #64748b;
        }

        .empty-state-text {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
        }

        .mt-1 { margin-top: 0.5rem; }
        .mt-2 { margin-top: 1rem; }
        .mt-3 { margin-top: 1.5rem; }
        .mb-1 { margin-bottom: 0.5rem; }
        .mb-2 { margin-bottom: 1rem; }
        .mb-3 { margin-bottom: 1.5rem; }
        .gap-2 { gap: 1rem; }
        .flex { display: flex; }
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .w-full { width: 100%; }
        .text-center { text-align: center; }
        .text-sm { font-size: 0.9rem; }
        .font-bold { font-weight: 700; }
        .opacity-50 { opacity: 0.5; }
    </style>
</head>
<body>
    <!-- HEADER -->
    <header>
        <div class="header-content">
            <div class="logo">
                <div class="logo-icon">PP</div>
                Pin Plan
            </div>
            <div class="nav-buttons">
                <button class="nav-btn active" onclick="switchSection('dashboard')">Dashboard</button>
                <button class="nav-btn" onclick="switchSection('metrics')">Metrics</button>
                <button class="nav-btn" onclick="switchSection('training')">Training</button>
                <button class="nav-btn" onclick="switchSection('cycles')">Cycles</button>
                <button class="nav-btn" onclick="switchSection('goals')">Goals</button>
                <button class="nav-btn" onclick="switchSection('settings')">Settings</button>
            </div>
        </div>
    </header>

    <!-- MAIN CONTAINER -->
    <div class="container">
        <!-- DASHBOARD SECTION -->
        <section id="dashboard" class="section active">
            <div class="hero">
                <h1>Ready to Crush Your Goals?</h1>
                <p id="heroSubtitle">Track your fitness journey with Pin Plan. Log metrics, build muscle, and transform your body.</p>
                <button class="btn-primary" onclick="openModal('metricsModal')">
                    Log Today's Metrics
                </button>
            </div>

            <div class="stats-grid" id="statsGrid">
                <!-- Stats loaded by JavaScript -->
            </div>

            <div class="grid grid-2">
                <div class="card">
                    <h2>Weight Progress</h2>
                    <div class="chart-container">
                        <canvas id="weightChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <h2>Calorie Intake</h2>
                    <div class="chart-container">
                        <canvas id="calorieChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <h2>Macro Distribution</h2>
                    <div class="chart-container">
                        <canvas id="macroChart"></canvas>
                    </div>
                </div>

                <div class="card">
                    <h2>Workout Frequency</h2>
                    <div class="chart-container">
                        <canvas id="workoutChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>AI Insights</h2>
                <div id="insightsContainer">
                    <!-- Insights loaded by JavaScript -->
                </div>
            </div>
        </section>

        <!-- METRICS SECTION -->
        <section id="metrics" class="section">
            <div class="hero">
                <h1>Metrics Dashboard</h1>
                <p>Track your nutrition, weight, and performance data</p>
                <button class="btn-primary" onclick="openModal('metricsModal')">
                    Add Entry
                </button>
            </div>

            <div class="card">
                <h2>Recent Entries</h2>
                <div style="overflow-x: auto;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Weight</th>
                                <th>Calories</th>
                                <th>Protein</th>
                                <th>Exercise</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="metricsTableBody">
                            <!-- Loaded by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- TRAINING SECTION -->
        <section id="training" class="section">
            <div class="hero">
                <h1>Training Tracker</h1>
                <p>Log your workouts and track your strength progress</p>
                <button class="btn-primary" onclick="openModal('trainingModal')">
                    Log Workout
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Workouts</div>
                    <div class="stat-value" id="totalWorkouts">0</div>
                    <div class="stat-unit">sessions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Minutes</div>
                    <div class="stat-value" id="totalMinutes">0</div>
                    <div class="stat-unit">minutes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Volume</div>
                    <div class="stat-value" id="totalVolume">0k</div>
                    <div class="stat-unit">lbs</div>
                </div>
            </div>

            <div class="card">
                <h2>Recent Workouts</h2>
                <div id="workoutsList">
                    <!-- Loaded by JavaScript -->
                </div>
            </div>
        </section>

        <!-- CYCLES SECTION -->
        <section id="cycles" class="section">
            <div class="hero">
                <h1>Training Cycles</h1>
                <p>Manage your training phases and nutrition targets</p>
                <button class="btn-primary" onclick="openModal('cycleModal')">
                    New Cycle
                </button>
            </div>

            <div id="activeCycleContainer"></div>

            <div class="grid">
                <div id="cyclesList">
                    <!-- Loaded by JavaScript -->
                </div>
            </div>
        </section>

        <!-- GOALS SECTION -->
        <section id="goals" class="section">
            <div class="hero">
                <h1>Fitness Goals</h1>
                <p>Set and track your fitness objectives</p>
                <button class="btn-primary" onclick="openModal('goalModal')">
                    New Goal
                </button>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Goals</div>
                    <div class="stat-value" id="totalGoals">0</div>
                    <div class="stat-unit">goals</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Active Goals</div>
                    <div class="stat-value" id="activeGoals">0</div>
                    <div class="stat-unit">in progress</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Completed</div>
                    <div class="stat-value" id="completedGoals">0</div>
                    <div class="stat-unit">achieved</div>
                </div>
            </div>

            <div class="grid">
                <div id="goalsList">
                    <!-- Loaded by JavaScript -->
                </div>
            </div>
        </section>

        <!-- SETTINGS SECTION -->
        <section id="settings" class="section">
            <div class="hero">
                <h1>Settings</h1>
                <p>Manage your app data and preferences</p>
            </div>

            <div class="grid">
                <div class="card">
                    <h2>Data Export</h2>
                    <p style="color: #cbd5e1; margin: 1rem 0;">Download all your data as a JSON file for backup or transfer.</p>
                    <button class="btn-primary" onclick="exportData()">
                        Export Data
                    </button>
                </div>

                <div class="card">
                    <h2>Data Import</h2>
                    <p style="color: #cbd5e1; margin: 1rem 0;">Restore your data from a previously exported JSON file.</p>
                    <button class="btn-primary" onclick="document.getElementById('importInput').click()">
                        Import Data
                    </button>
                    <input type="file" id="importInput" accept=".json" style="display: none;" onchange="importData(event)">
                </div>

                <div class="card">
                    <h2>Clear All Data</h2>
                    <p style="color: #cbd5e1; margin: 1rem 0;">Delete all stored data. This action cannot be undone.</p>
                    <button class="btn-secondary" style="background: var(--danger); border-color: var(--danger); color: white;" onclick="if(confirm('Are you sure? This cannot be undone.')) { clearAllData(); }">
                        Delete All
                    </button>
                </div>

                <div class="card">
                    <h2>About Pin Plan</h2>
                    <p style="color: #cbd5e1; margin: 1rem 0;">
                        <strong>Version:</strong> 2.0<br>
                        <strong>Features:</strong> Fitness tracking, cycle management, goal setting, AI insights<br>
                        <strong>Storage:</strong> 100% local (browser)<br>
                        <strong>Privacy:</strong> Your data never leaves your device
                    </p>
                </div>
            </div>
        </section>
    </div>

    <!-- MODALS -->
    
    <!-- Metrics Modal -->
    <div id="metricsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">Log Metrics</div>
            <div class="form-group">
                <label>Weight (lbs)</label>
                <input type="number" id="metricsWeight" placeholder="185">
            </div>
            <div class="form-group">
                <label>Calories</label>
                <input type="number" id="metricsCalories" value="2500">
            </div>
            <div class="form-group">
                <label>Protein (g)</label>
                <input type="number" id="metricsProtein" value="150">
            </div>
            <div class="form-group">
                <label>Carbs (g)</label>
                <input type="number" id="metricsCarbs" value="300">
            </div>
            <div class="form-group">
                <label>Fats (g)</label>
                <input type="number" id="metricsFats" value="60">
            </div>
            <div class="form-group">
                <label>Exercise Minutes</label>
                <input type="number" id="metricsExercise" placeholder="0">
            </div>
            <div class="form-group">
                <label>Sleep Hours</label>
                <input type="number" id="metricsSleep" value="8" step="0.5">
            </div>
            <div class="form-group">
                <label>Mood</label>
                <select id="metricsMood">
                    <option value="excellent">Excellent</option>
                    <option value="good" selected>Good</option>
                    <option value="okay">Okay</option>
                    <option value="poor">Poor</option>
                </select>
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="metricsNotes" placeholder="Add any notes..."></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="saveMetric()">Save</button>
                <button class="btn-secondary" onclick="closeModal('metricsModal')">Cancel</button>
            </div>
        </div>
    </div>

    <!-- Training Modal -->
    <div id="trainingModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">Log Workout</div>
            <div class="form-group">
                <label>Date</label>
                <input type="date" id="trainingDate">
            </div>
            <div class="form-group">
                <label>Exercise Type</label>
                <select id="trainingType">
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="mixed">Mixed</option>
                </select>
            </div>
            <div class="form-group">
                <label>Duration (minutes)</label>
                <input type="number" id="trainingDuration" placeholder="60">
            </div>
            <div class="form-group">
                <label>Intensity</label>
                <select id="trainingIntensity">
                    <option value="light">Light</option>
                    <option value="moderate" selected>Moderate</option>
                    <option value="intense">Intense</option>
                </select>
            </div>
            <div class="form-group">
                <label>Exercise Name</label>
                <input type="text" id="trainingExercise" placeholder="e.g., Bench Press">
            </div>
            <div class="form-group">
                <label>Sets</label>
                <input type="number" id="trainingSets" value="3">
            </div>
            <div class="form-group">
                <label>Reps</label>
                <input type="number" id="trainingReps" value="10">
            </div>
            <div class="form-group">
                <label>Weight (lbs)</label>
                <input type="number" id="trainingWeight" placeholder="225">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="trainingNotes" placeholder="Add any notes..."></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="saveTraining()">Save</button>
                <button class="btn-secondary" onclick="closeModal('trainingModal')">Cancel</button>
            </div>
        </div>
    </div>

    <!-- Cycle Modal -->
    <div id="cycleModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">New Cycle</div>
            <div class="form-group">
                <label>Cycle Name</label>
                <input type="text" id="cycleName" placeholder="e.g., Summer Bulk">
            </div>
            <div class="form-group">
                <label>Type</label>
                <select id="cycleType">
                    <option value="bulking">Bulking</option>
                    <option value="cutting">Cutting</option>
                    <option value="maintenance" selected>Maintenance</option>
                    <option value="rest">Rest</option>
                </select>
            </div>
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" id="cycleStart">
            </div>
            <div class="form-group">
                <label>End Date</label>
                <input type="date" id="cycleEnd">
            </div>
            <div class="form-group">
                <label>Target Calories</label>
                <input type="number" id="cycleCalories" value="2500">
            </div>
            <div class="form-group">
                <label>Target Protein (g)</label>
                <input type="number" id="cycleProtein" value="150">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="cycleNotes" placeholder="Add any notes..."></textarea>
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="saveCycle()">Create</button>
                <button class="btn-secondary" onclick="closeModal('cycleModal')">Cancel</button>
            </div>
        </div>
    </div>

    <!-- Goal Modal -->
    <div id="goalModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">New Goal</div>
            <div class="form-group">
                <label>Goal Name</label>
                <input type="text" id="goalName" placeholder="e.g., Bench 315 lbs">
            </div>
            <div class="form-group">
                <label>Category</label>
                <select id="goalCategory">
                    <option value="weight">Weight</option>
                    <option value="strength">Strength</option>
                    <option value="performance">Performance</option>
                    <option value="health">Health</option>
                </select>
            </div>
            <div class="form-group">
                <label>Unit</label>
                <input type="text" id="goalUnit" placeholder="e.g., lbs, kg, miles">
            </div>
            <div class="form-group">
                <label>Current Value</label>
                <input type="number" id="goalCurrent" placeholder="0">
            </div>
            <div class="form-group">
                <label>Target Value</label>
                <input type="number" id="goalTarget" placeholder="0">
            </div>
            <div class="form-group">
                <label>Deadline</label>
                <input type="date" id="goalDeadline">
            </div>
            <div class="modal-footer">
                <button class="btn-primary" onclick="saveGoal()">Create</button>
                <button class="btn-secondary" onclick="closeModal('goalModal')">Cancel</button>
            </div>
        </div>
    </div>

    <script>
        class PinPlanApp {
            constructor() {
                this.metrics = JSON.parse(localStorage.getItem('pinplan_metrics')) || [];
                this.training = JSON.parse(localStorage.getItem('pinplan_training')) || [];
                this.cycles = JSON.parse(localStorage.getItem('pinplan_cycles')) || [];
                this.goals = JSON.parse(localStorage.getItem('pinplan_goals')) || [];
                this.charts = {};
                this.init();
            }

            init() {
                this.setDefaultDates();
                this.render();
                this.setupEventListeners();
            }

            setDefaultDates() {
                const today = new Date().toISOString().split('T')[0];
                document.getElementById('trainingDate').value = today;
                document.getElementById('cycleStart').value = today;
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 28);
                document.getElementById('cycleEnd').value = endDate.toISOString().split('T')[0];
                document.getElementById('goalDeadline').value = endDate.toISOString().split('T')[0];
            }

            setupEventListeners() {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.classList.remove('active');
                        }
                    });
                });
            }

            render() {
                this.renderDashboard();
                this.renderMetrics();
                this.renderTraining();
                this.renderCycles();
                this.renderGoals();
            }

            renderDashboard() {
                const stats = this.getStatistics();
                
                const currentCycle = this.getCurrentCycle();
                if (currentCycle) {
                    document.getElementById('heroSubtitle').textContent = `Current Phase: ${currentCycle.name} | Target: ${currentCycle.calories} kcal/day`;
                }

                const statsHtml = `
                    <div class="stat-card">
                        <div class="stat-label">Avg Calories</div>
                        <div class="stat-value">${Math.round(stats.avgCalories)}</div>
                        <div class="stat-unit">kcal/day</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Avg Protein</div>
                        <div class="stat-value">${Math.round(stats.avgProtein)}</div>
                        <div class="stat-unit">g/day</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Avg Weight</div>
                        <div class="stat-value">${stats.avgWeight.toFixed(1)}</div>
                        <div class="stat-unit">lbs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Workouts</div>
                        <div class="stat-value">${stats.workouts}</div>
                        <div class="stat-unit">sessions</div>
                    </div>
                `;
                document.getElementById('statsGrid').innerHTML = statsHtml;

                this.renderInsights();
                this.createCharts();
            }

            renderMetrics() {
                const tbody = document.getElementById('metricsTableBody');
                if (this.metrics.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="text-center" style="padding: 2rem;">No metrics logged yet. Start tracking!</td></tr>';
                    return;
                }

                tbody.innerHTML = this.metrics
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(m => `
                        <tr>
                            <td>${m.date}</td>
                            <td>${m.weight}lbs</td>
                            <td>${m.calories}kcal</td>
                            <td>${m.protein}g</td>
                            <td>${m.exercise}min</td>
                            <td>
                                <button class="icon-btn text-danger" onclick="app.deleteMetric('${m.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('');
            }

            renderTraining() {
                document.getElementById('totalWorkouts').textContent = this.training.length;
                document.getElementById('totalMinutes').textContent = this.training.reduce((sum, t) => sum + t.duration, 0);
                
                const volume = this.training.reduce((sum, t) => sum + (t.weight * t.sets * t.reps), 0);
                document.getElementById('totalVolume').textContent = (volume / 1000).toFixed(1) + 'k';

                const workoutsList = document.getElementById('workoutsList');
                if (this.training.length === 0) {
                    workoutsList.innerHTML = '<div class="empty-state"><div class="empty-state-text">No workouts logged yet</div></div>';
                    return;
                }

                workoutsList.innerHTML = this.training
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(t => `
                        <div style="background: rgba(14, 165, 233, 0.1); border-left: 4px solid var(--primary); border-radius: 8px; padding: 1.5rem; margin: 1rem 0;">
                            <div class="flex-between mb-2">
                                <div>
                                    <strong>${t.name}</strong><br>
                                    <span style="color: #94a3b8; font-size: 0.9rem;">${t.type} | ${t.date}</span>
                                </div>
                                <button class="icon-btn text-danger" onclick="app.deleteTraining('${t.id}')">Delete</button>
                            </div>
                            <div style="color: #cbd5e1; font-size: 0.95rem;">
                                ${t.sets}x${t.reps} @ ${t.weight}lbs | ${t.duration}min | ${t.intensity}
                            </div>
                        </div>
                    `).join('');
            }

            renderCycles() {
                const currentCycle = this.getCurrentCycle();
                const container = document.getElementById('activeCycleContainer');
                
                if (currentCycle) {
                    container.innerHTML = `
                        <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(14, 165, 233, 0.1)); border: 2px solid var(--secondary); border-radius: 16px; padding: 2rem; margin-bottom: 2rem;">
                            <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Active Cycle</h3>
                            <div style="font-size: 1.3rem; font-weight: 700; margin-bottom: 1rem;">${currentCycle.name}</div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; color: #cbd5e1;">
                                <div>
                                    <div style="color: #94a3b8; font-size: 0.9rem;">Target Calories</div>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary);">${currentCycle.calories} kcal</div>
                                </div>
                                <div>
                                    <div style="color: #94a3b8; font-size: 0.9rem;">Target Protein</div>
                                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${currentCycle.protein}g</div>
                                </div>
                                <div>
                                    <div style="color: #94a3b8; font-size: 0.9rem;">Start Date</div>
                                    <div style="font-weight: 600;">${currentCycle.start}</div>
                                </div>
                                <div>
                                    <div style="color: #94a3b8; font-size: 0.9rem;">End Date</div>
                                    <div style="font-weight: 600;">${currentCycle.end}</div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    container.innerHTML = '';
                }

                const cyclesList = document.getElementById('cyclesList');
                if (this.cycles.length === 0) {
                    cyclesList.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-state-text">No cycles created yet</div></div>';
                    return;
                }

                cyclesList.innerHTML = this.cycles
                    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
                    .map(c => `
                        <div class="card">
                            <div class="flex-between mb-2">
                                <div>
                                    <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${c.name}</h3>
                                    <span class="badge">${c.type.toUpperCase()}</span>
                                </div>
                                <button class="icon-btn text-danger" onclick="app.deleteCycle('${c.id}')">Delete</button>
                            </div>
                            <div style="margin: 1rem 0; padding: 1rem 0; border-top: 1px solid #334155; border-bottom: 1px solid #334155; color: #cbd5e1;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.95rem;">
                                    <div><strong>Start:</strong> ${c.start}</div>
                                    <div><strong>End:</strong> ${c.end}</div>
                                    <div><strong>Calories:</strong> ${c.calories} kcal</div>
                                    <div><strong>Protein:</strong> ${c.protein}g</div>
                                </div>
                            </div>
                        </div>
                    `).join('');
            }

            renderGoals() {
                const totalGoals = this.goals.length;
                const activeGoals = this.goals.filter(g => g.progress < 100).length;
                const completedGoals = this.goals.filter(g => g.progress === 100).length;

                document.getElementById('totalGoals').textContent = totalGoals;
                document.getElementById('activeGoals').textContent = activeGoals;
                document.getElementById('completedGoals').textContent = completedGoals;

                const goalsList = document.getElementById('goalsList');
                if (this.goals.length === 0) {
                    goalsList.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-state-text">No goals set yet</div></div>';
                    return;
                }

                goalsList.innerHTML = this.goals.map(g => {
                    const progress = Math.min((g.current / g.target) * 100, 100);
                    return `
                        <div class="card">
                            <div class="flex-between mb-2">
                                <h3>${g.name}</h3>
                                <button class="icon-btn text-danger" onclick="app.deleteGoal('${g.id}')">Delete</button>
                            </div>
                            <span class="badge">${g.category.toUpperCase()}</span>
                            <div style="margin: 1rem 0;">
                                <div class="flex-between mb-1">
                                    <span>Progress</span>
                                    <strong>${Math.round(progress)}%</strong>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progress}%"></div>
                                </div>
                            </div>
                            <div style="color: #cbd5e1; font-size: 0.95rem;">
                                <div><strong>Current:</strong> ${g.current} ${g.unit}</div>
                                <div><strong>Target:</strong> ${g.target} ${g.unit}</div>
                                <div><strong>Deadline:</strong> ${g.deadline}</div>
                            </div>
                            <button class="btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="updateGoal('${g.id}')">Update Value</button>
                        </div>
                    `;
                }).join('');
            }

            renderInsights() {
                const insights = this.generateInsights();
                const container = document.getElementById('insightsContainer');
                
                if (insights.length === 0) {
                    container.innerHTML = '<div style="color: #64748b; text-align: center; padding: 2rem;">Log more data to get insights</div>';
                    return;
                }

                container.innerHTML = insights.map(i => `
                    <div class="insight-card">
                        <div class="insight-title">${i.title}</div>
                        <div class="insight-text">${i.text}</div>
                    </div>
                `).join('');
            }

            generateInsights() {
                const stats = this.getStatistics();
                const insights = [];

                if (stats.workouts > 10) {
                    insights.push({
                        title: 'Consistency Champion',
                        text: `You've logged ${stats.workouts} workouts. Keep pushing!`
                    });
                }

                if (stats.avgProtein < 100) {
                    insights.push({
                        title: 'Boost Your Protein',
                        text: `Average protein is ${Math.round(stats.avgProtein)}g. Aim for 0.8-1g per lb of bodyweight.`
                    });
                }

                if (this.metrics.length > 7) {
                    const recent = this.metrics.slice(-7);
                    const weightChange = recent[recent.length - 1].weight - recent[0].weight;
                    if (Math.abs(weightChange) > 0.5) {
                        insights.push({
                            title: 'Weight Trend',
                            text: `Your weight changed by ${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}lbs in the last week.`
                        });
                    }
                }

                if (stats.avgSleep < 7) {
                    insights.push({
                        title: 'Get More Sleep',
                        text: `Average sleep is ${stats.avgSleep.toFixed(1)} hours. Aim for 7-9 hours for recovery.`
                    });
                }

                return insights;
            }

            getStatistics() {
                const last30 = this.metrics.filter(m => {
                    const date = new Date(m.date);
                    const now = new Date();
                    return (now.getTime() - date.getTime()) <= 30 * 24 * 60 * 60 * 1000;
                });

                return {
                    avgCalories: last30.length ? last30.reduce((sum, m) => sum + m.calories, 0) / last30.length : 0,
                    avgProtein: last30.length ? last30.reduce((sum, m) => sum + m.protein, 0) / last30.length : 0,
                    avgWeight: last30.length ? last30.reduce((sum, m) => sum + m.weight, 0) / last30.length : 0,
                    avgSleep: last30.length ? last30.reduce((sum, m) => sum + m.sleep, 0) / last30.length : 0,
                    workouts: this.training.filter(t => {
                        const date = new Date(t.date);
                        const now = new Date();
                        return (now.getTime() - date.getTime()) <= 30 * 24 * 60 * 60 * 1000;
                    }).length
                };
            }

            getCurrentCycle() {
                const today = new Date().toISOString().split('T')[0];
                return this.cycles.find(c => c.start <= today && today <= c.end);
            }

            createCharts() {
                if (this.metrics.length > 0) {
                    const ctx = document.getElementById('weightChart');
                    if (this.charts.weight) this.charts.weight.destroy();
                    
                    this.charts.weight = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: this.metrics.map(m => m.date),
                            datasets: [{
                                label: 'Weight (lbs)',
                                data: this.metrics.map(m => m.weight),
                                borderColor: '#fbbf24',
                                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                                borderWidth: 2,
                                fill: true,
                                tension: 0.4
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                            }
                        }
                    });

                    const ctx2 = document.getElementById('calorieChart');
                    if (this.charts.calorie) this.charts.calorie.destroy();
                    
                    this.charts.calorie = new Chart(ctx2, {
                        type: 'bar',
                        data: {
                            labels: this.metrics.map(m => m.date),
                            datasets: [{
                                label: 'Calories',
                                data: this.metrics.map(m => m.calories),
                                backgroundColor: '#f59e0b',
                                borderRadius: 8
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                            }
                        }
                    });

                    const ctx3 = document.getElementById('macroChart');
                    if (this.charts.macro) this.charts.macro.destroy();
                    
                    const avgProtein = this.getStatistics().avgProtein;
                    this.charts.macro = new Chart(ctx3, {
                        type: 'doughnut',
                        data: {
                            labels: ['Protein', 'Carbs', 'Fats'],
                            datasets: [{
                                data: [avgProtein, avgProtein * 2, avgProtein * 0.8],
                                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                                borderColor: '#1e293b',
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { labels: { color: '#cbd5e1' } } }
                        }
                    });

                    const ctx4 = document.getElementById('workoutChart');
                    if (this.charts.workout) this.charts.workout.destroy();
                    
                    this.charts.workout = new Chart(ctx4, {
                        type: 'bar',
                        data: {
                            labels: this.training.map(t => t.date),
                            datasets: [{
                                label: 'Minutes',
                                data: this.training.map(t => t.duration),
                                backgroundColor: '#06b6d4',
                                borderRadius: 8
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                            }
                        }
                    });
                }
            }

            addMetric(data) {
                this.metrics.push({
                    id: Date.now().toString(),
                    date: new Date().toISOString().split('T')[0],
                    ...data
                });
                this.save();
            }

            deleteMetric(id) {
                this.metrics = this.metrics.filter(m => m.id !== id);
                this.save();
            }

            addTraining(data) {
                this.training.push({
                    id: Date.now().toString(),
                    ...data
                });
                this.save();
            }

            deleteTraining(id) {
                this.training = this.training.filter(t => t.id !== id);
                this.save();
            }

            addCycle(data) {
                this.cycles.push({
                    id: Date.now().toString(),
                    ...data
                });
                this.save();
            }

            deleteCycle(id) {
                this.cycles = this.cycles.filter(c => c.id !== id);
                this.save();
            }

            addGoal(data) {
                this.goals.push({
                    id: Date.now().toString(),
                    progress: (data.current / data.target) * 100,
                    ...data
                });
                this.save();
            }

            deleteGoal(id) {
                this.goals = this.goals.filter(g => g.id !== id);
                this.save();
            }

            updateGoal(id, current) {
                const goal = this.goals.find(g => g.id === id);
                if (goal) {
                    goal.current = current;
                    goal.progress = (current / goal.target) * 100;
                    this.save();
                }
            }

            save() {
                localStorage.setItem('pinplan_metrics', JSON.stringify(this.metrics));
                localStorage.setItem('pinplan_training', JSON.stringify(this.training));
                localStorage.setItem('pinplan_cycles', JSON.stringify(this.cycles));
                localStorage.setItem('pinplan_goals', JSON.stringify(this.goals));
                this.render();
            }

            export() {
                return {
                    metrics: this.metrics,
                    training: this.training,
                    cycles: this.cycles,
                    goals: this.goals,
                    timestamp: new Date().toISOString()
                };
            }

            import(data) {
                if (data.metrics) this.metrics = data.metrics;
                if (data.training) this.training = data.training;
                if (data.cycles) this.cycles = data.cycles;
                if (data.goals) this.goals = data.goals;
                this.save();
            }
        }

        let app = new PinPlanApp();

        function switchSection(sectionId) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.getElementById(sectionId).classList.add('active');
            
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
        }

        function openModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        function saveMetric() {
            const data = {
                weight: parseFloat(document.getElementById('metricsWeight').value) || 0,
                calories: parseFloat(document.getElementById('metricsCalories').value) || 0,
                protein: parseFloat(document.getElementById('metricsProtein').value) || 0,
                carbs: parseFloat(document.getElementById('metricsCarbs').value) || 0,
                fats: parseFloat(document.getElementById('metricsFats').value) || 0,
                exercise: parseFloat(document.getElementById('metricsExercise').value) || 0,
                sleep: parseFloat(document.getElementById('metricsSleep').value) || 0,
                mood: document.getElementById('metricsMood').value,
                notes: document.getElementById('metricsNotes').value
            };
            app.addMetric(data);
            closeModal('metricsModal');
            alert('Metrics saved');
        }

        function saveTraining() {
            const data = {
                date: document.getElementById('trainingDate').value,
                type: document.getElementById('trainingType').value,
                name: document.getElementById('trainingExercise').value,
                duration: parseFloat(document.getElementById('trainingDuration').value) || 0,
                intensity: document.getElementById('trainingIntensity').value,
                sets: parseFloat(document.getElementById('trainingSets').value) || 0,
                reps: parseFloat(document.getElementById('trainingReps').value) || 0,
                weight: parseFloat(document.getElementById('trainingWeight').value) || 0,
                notes: document.getElementById('trainingNotes').value
            };
            app.addTraining(data);
            closeModal('trainingModal');
            alert('Workout saved');
        }

        function saveCycle() {
            const data = {
                name: document.getElementById('cycleName').value,
                type: document.getElementById('cycleType').value,
                start: document.getElementById('cycleStart').value,
                end: document.getElementById('cycleEnd').value,
                calories: parseFloat(document.getElementById('cycleCalories').value) || 0,
                protein: parseFloat(document.getElementById('cycleProtein').value) || 0,
                notes: document.getElementById('cycleNotes').value
            };
            app.addCycle(data);
            closeModal('cycleModal');
            alert('Cycle created');
        }

        function saveGoal() {
            const data = {
                name: document.getElementById('goalName').value,
                category: document.getElementById('goalCategory').value,
                unit: document.getElementById('goalUnit').value,
                current: parseFloat(document.getElementById('goalCurrent').value) || 0,
                target: parseFloat(document.getElementById('goalTarget').value) || 0,
                deadline: document.getElementById('goalDeadline').value
            };
            app.addGoal(data);
            closeModal('goalModal');
            alert('Goal created');
        }

        function updateGoal(id) {
            const goal = app.goals.find(g => g.id === id);
            const newValue = prompt(`Update ${goal.name} (current: ${goal.current} ${goal.unit}):`, goal.current);
            if (newValue !== null) {
                app.updateGoal(id, parseFloat(newValue));
                alert('Goal updated');
            }
        }

        function exportData() {
            const data = app.export();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pinplan-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            alert('Data exported');
        }

        function importData(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    app.import(data);
                    alert('Data imported successfully');
                } catch (err) {
                    alert('Error importing data');
                }
            };
            reader.readAsText(file);
        }

        function clearAllData() {
            app.metrics = [];
            app.training = [];
            app.cycles = [];
            app.goals = [];
            app.save();
            alert('All data cleared');
        }
    </script>
</body>
</html>
