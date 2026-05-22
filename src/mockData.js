// Mock Database & Serverless Interceptor Layer
// Fully simulates network request/response cycles and persists state inside localStorage.

const LATENCY_MS = 300; // Simulated latency to enable beautiful loading skeletons

// 1. Course Modules Static Data
export const INITIAL_MODULES = [
  {
    id: "ai-agents",
    title: "AI Agents",
    level: "Advanced",
    status: "Enroll Now",
    duration: "12 Weeks",
    description: "Build autonomous intelligence systems that solve complex, multi-step actions. Master agent logic, prompt chaining, vector stores, and tool integration.",
    syllabus: [
      { week: "Weeks 1-3", title: "Agent Core Foundations", topics: ["LLM Agents Overview", "Prompt Engineering & Structured Output", "State Machines & Agent Loops"] },
      { week: "Weeks 4-6", title: "Memory & Cognitive Architectures", topics: ["Vector Databases & RAG", "Short-term vs Long-term Agent Memory", "Semantic Cache Systems"] },
      { week: "Weeks 7-9", title: "Tool Integration & Action Spaces", topics: ["API Calling & Tool Use", "Web Scraping Agents", "Autonomous Coding Agents"] },
      { week: "Weeks 10-12", title: "Deployment & Production Scaling", topics: ["LangChain / LangGraph in Production", "Agent Monitoring & Tracing", "Capstone Project: Enterprise Multi-Agent Team"] }
    ]
  },
  {
    id: "iot",
    title: "IoT",
    level: "Intermediate",
    status: "Enroll Now",
    duration: "10 Weeks",
    description: "Bridge the gap between physical sensors and cloud networks. Learn edge computing, microcontrollers, real-time telemetry, and device security.",
    syllabus: [
      { week: "Weeks 1-2", title: "Microcontroller Ecosystems", topics: ["ESP32 & Raspberry Pi Basics", "GPIO Interfaces & Sensors Reading", "Embedded C & MicroPython Programming"] },
      { week: "Weeks 3-5", title: "Connectivity Protocols", topics: ["MQTT Protocol & Message Brokers", "HTTP APIs & Web Sockets", "LoRaWAN & Cellular IoT Overview"] },
      { week: "Weeks 6-8", title: "Edge Processing & Cloud Telemetry", topics: ["Edge AI & Analytics", "AWS IoT Core Integration", "Grafana Dashboards & Real-time Alerts"] },
      { week: "Weeks 9-10", title: "Security & Capstone", topics: ["Device Authentication & SSL/TLS", "Firmware OTA Updates", "Capstone: Automated Smart Agriculture Node"] }
    ]
  },
  {
    id: "multi-cloud",
    title: "Multi Cloud",
    level: "Advanced",
    status: "Coming Soon",
    duration: "12 Weeks",
    description: "Architect high-availability systems across AWS, Azure, and Google Cloud. Master Kubernetes orchestration, global load balancing, and cost optimization.",
    syllabus: [
      { week: "Weeks 1-3", title: "Cloud Foundations & Terraform", topics: ["Multi-Cloud Strategy and Use Cases", "Infrastructure as Code (IaC) with Terraform", "Multi-Provider Setup"] },
      { week: "Weeks 4-6", title: "Global Load Balancing & DNS", topics: ["Cross-Cloud Routing Policies", "Global Server Load Balancing (GSLB)", "Failover Strategies"] },
      { week: "Weeks 7-9", title: "Containerization & Kubernetes", topics: ["Docker Container Optimization", "Multi-Cluster Kubernetes with Rancher", "Service Mesh (Istio) Integration"] },
      { week: "Weeks 10-12", title: "Governance, Security & Cost", topics: ["Unified Identity Management", "Multi-Cloud Cost Control", "Capstone: Automated Multi-Cloud DR Site"] }
    ]
  },
  {
    id: "data-engineering",
    title: "Data Engineering",
    level: "Intermediate",
    status: "Enroll Now",
    duration: "8 Weeks",
    description: "Design robust pipelines that process massive datasets. Learn data warehousing, ETL orchestration with Airflow, and distributed processing with Spark.",
    syllabus: [
      { week: "Weeks 1-2", title: "Data Storage & Modeling", topics: ["Relational vs NoSQL Databases", "Data Warehousing Basics (Snowflake/BigQuery)", "Dimensional Modeling"] },
      { week: "Weeks 3-4", title: "ETL & Pipeline Orchestration", topics: ["Python Data Processing", "Apache Airflow Basics", "Building Resilient Batch Pipelines"] },
      { week: "Weeks 5-6", title: "Distributed Processing", topics: ["Apache Spark and PySpark Core", "Streaming Data with Apache Kafka", "Delta Lake Architecture"] },
      { week: "Weeks 7-8", title: "Data Quality & Operations", topics: ["Data Validation with Great Expectations", "Data Cataloging & Lineage", "Capstone: Real-time Analytics Pipeline"] }
    ]
  },
  {
    id: "project-management",
    title: "Project Management",
    level: "Beginner",
    status: "Enroll Now",
    duration: "6 Weeks",
    description: "Master the frameworks required to lead cross-functional tech teams. Learn budget planning, risk mitigation, and agile methodologies.",
    syllabus: [
      { week: "Week 1", title: "Project Initiation", topics: ["Defining Project Scope & Objectives", "Stakeholder Identification & Analysis", "Creating the Project Charter"] },
      { week: "Week 2", title: "Planning & Scheduling", topics: ["Work Breakdown Structure (WBS)", "Gantt Charts & Critical Path Method", "Resource Allocation Models"] },
      { week: "Weeks 3-4", title: "Execution & Monitoring", topics: ["Key Performance Indicators (KPIs)", "Budgeting and Earned Value Management", "Risk Assessment & Mitigation Plans"] },
      { week: "Weeks 5-6", title: "Closing & Capstone", topics: ["Project Handover Protocols", "Retrospectives & Post-Mortems", "Capstone: Comprehensive Project Plan Development"] }
    ]
  },
  {
    id: "scrum-master",
    title: "Scrum Master",
    level: "Beginner",
    status: "Enroll Now",
    duration: "6 Weeks",
    description: "Facilitate high-velocity agile sprints. Master sprint planning, daily standups, burn-down charts, and fostering self-organizing teams.",
    syllabus: [
      { week: "Week 1", title: "Agile Mindset & Scrum Core", topics: ["The Agile Manifesto and Principles", "Scrum Framework Overview", "Scrum Pillars and Values"] },
      { week: "Week 2", title: "Scrum Roles & Accountabilities", topics: ["Product Owner vs Scrum Master", "The Developers Responsibilities", "Servant Leadership Concept"] },
      { week: "Weeks 3-4", title: "Scrum Events & Artifacts", topics: ["Sprint Planning & Backlog Refinement", "Daily Scrum & Retrospectives", "Product Backlog, Sprint Backlog & Increment"] },
      { week: "Weeks 5-6", title: "Metrics & Fostering Collaboration", topics: ["Sprint Velocity & Burndown Charts", "Resolving Impediments & Team Conflicts", "Capstone: Sprints Simulation and Facilitation"] }
    ]
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    level: "Intermediate",
    status: "Coming Soon",
    duration: "8 Weeks",
    description: "Turn raw metrics into business intelligence. Master SQL queries, data cleaning with Pandas, and interactive dashboards in Tableau and PowerBI.",
    syllabus: [
      { week: "Weeks 1-2", title: "SQL & Relational Databases", topics: ["Advanced Selects & Joins", "Aggregations & Grouping", "Window Functions & Subqueries"] },
      { week: "Weeks 3-4", title: "Python Data Analysis", topics: ["Pandas DataFrames", "Data Wrangling & Cleaning Techniques", "Exploratory Data Analysis (EDA)"] },
      { week: "Weeks 5-6", title: "Visualization & Dashboards", topics: ["Designing Dashboards in Tableau", "PowerBI Integration", "Data Storytelling for Executives"] },
      { week: "Weeks 7-8", title: "Statistical Analysis & Capstone", topics: ["A/B Testing Basics", "Linear Regression Overview", "Capstone: Executive E-commerce Report"] }
    ]
  }
];

// 2. Initialize DB States in LocalStorage
const getStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  if (!item) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Seed Initial Mock Database States
const initializeDB = () => {
  /*
  getStorageItem("nc_user", {
    id: "user_1",
    firstName: "Sarah",
    lastName: "Chen",
    bio: "AI Researcher and automation enthusiast. Building next-generation digital workers.",
    email: "sarah.chen@techcorp.com"
  });
  */
  getStorageItem("nc_user", null);

  getStorageItem("nc_enrollments", [
    { id: "enroll_1", moduleId: "ai-agents", enrolledAt: new Date().toISOString() }
  ]);

  getStorageItem("nc_projects", [
    {
      id: "project_1",
      title: "Autonomous Customer Support Fleet",
      description: "An orchestration of 3 interconnected AI Agents handling tier-1 emails, generating drafts, and verifying invoice details.",
      moduleId: "ai-agents",
      progress: 65,
      status: "active",
      createdAt: new Date().toISOString()
    }
  ]);

  getStorageItem("nc_certifications", []);
};

initializeDB();

// Simulated sleep/latency helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to construct a Mock Response Object
const mockResponse = (data, status = 200, statusText = "OK") => {
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: { "Content-Type": "application/json" }
  });
};

// 3. Register Global window.fetch Interceptor Router
export const installMockApi = () => {
  const originalFetch = window.fetch;

  window.fetch = async function (url, options = {}) {
    const urlString = typeof url === "string" ? url : url.url;
    
    // Process only mock API calls
    if (urlString.startsWith("/api/")) {
      await sleep(LATENCY_MS);
      
      const method = (options.method || "GET").toUpperCase();
      const body = options.body ? JSON.parse(options.body) : null;
      console.log(`[MOCK SERVER] Intercepted ${method} ${urlString}`, body);

      // --- USER / AUTH ENDPOINTS ---
      if (urlString === "/api/auth/user") {
        const user = getStorageItem("nc_user", null);
        if (!user) return mockResponse({ error: "Unauthorized" }, 401);
        return mockResponse(user);
      }

      if (urlString === "/api/logout") {
        localStorage.removeItem("nc_user");
        return mockResponse({ success: true });
      }

      if (urlString === "/api/users/profile") {
        if (method === "PATCH" || method === "PUT") {
          const user = getStorageItem("nc_user", {});
          const updatedUser = { ...user, ...body };
          setStorageItem("nc_user", updatedUser);
          return mockResponse(updatedUser);
        }
      }

      // --- MODULES ENDPOINTS ---
      if (urlString === "/api/modules") {
        return mockResponse(INITIAL_MODULES);
      }

      const moduleMatch = urlString.match(/\/api\/modules\/([a-zA-Z0-9_-]+)/);
      if (moduleMatch) {
        const moduleId = moduleMatch[1];
        const m = INITIAL_MODULES.find(x => x.id === moduleId);
        if (!m) return mockResponse({ error: "Module not found" }, 404);
        return mockResponse(m);
      }

      // --- ENROLLMENTS ENDPOINTS ---
      if (urlString === "/api/enrollments") {
        const enrollments = getStorageItem("nc_enrollments", []);
        if (method === "GET") {
          return mockResponse(enrollments);
        }
        if (method === "POST") {
          const { moduleId } = body;
          const exists = enrollments.some(e => e.moduleId === moduleId);
          if (exists) {
            return mockResponse(enrollments.find(e => e.moduleId === moduleId));
          }
          const newEnroll = {
            id: `enroll_${Date.now()}`,
            moduleId,
            enrolledAt: new Date().toISOString()
          };
          enrollments.push(newEnroll);
          setStorageItem("nc_enrollments", enrollments);
          return mockResponse(newEnroll);
        }
      }

      // --- PROJECTS ENDPOINTS ---
      if (urlString === "/api/projects") {
        const projects = getStorageItem("nc_projects", []);
        if (method === "GET") {
          return mockResponse(projects);
        }
        if (method === "POST") {
          const newProject = {
            id: `project_${Date.now()}`,
            title: body.title,
            description: body.description,
            moduleId: body.moduleId,
            progress: 0,
            status: "active",
            createdAt: new Date().toISOString()
          };
          projects.push(newProject);
          setStorageItem("nc_projects", projects);

          // Update stats
          return mockResponse(newProject);
        }
      }

      const projectMatch = urlString.match(/\/api\/projects\/([a-zA-Z0-9_-]+)/);
      if (projectMatch) {
        const projectId = projectMatch[1];
        const projects = getStorageItem("nc_projects", []);
        const idx = projects.findIndex(p => p.id === projectId);
        if (idx === -1) return mockResponse({ error: "Project not found" }, 404);

        if (method === "GET") {
          return mockResponse(projects[idx]);
        }
        if (method === "PATCH" || method === "PUT") {
          const updated = { ...projects[idx], ...body };
          projects[idx] = updated;
          setStorageItem("nc_projects", projects);

          // Auto-unlock certification if progress becomes 100%
          if (updated.progress === 100 && updated.status === "completed") {
            const certs = getStorageItem("nc_certifications", []);
            const alreadyCertified = certs.some(c => c.moduleId === updated.moduleId);
            if (!alreadyCertified) {
              const moduleObj = INITIAL_MODULES.find(m => m.id === updated.moduleId);
              const newCert = {
                id: `cert_${Date.now()}`,
                moduleId: updated.moduleId,
                moduleTitle: moduleObj ? moduleObj.title : "Course Module",
                unlockedAt: new Date().toISOString(),
                credentialId: `NC-${updated.moduleId.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
              };
              certs.push(newCert);
              setStorageItem("nc_certifications", certs);
            }
          }

          return mockResponse(updated);
        }
      }

      // --- CERTIFICATIONS ENDPOINTS ---
      if (urlString === "/api/certifications") {
        const certs = getStorageItem("nc_certifications", []);
        return mockResponse(certs);
      }

      // --- DASHBOARD STATS ---
      if (urlString === "/api/dashboard/stats") {
        const user = getStorageItem("nc_user", null);
        if (!user) return mockResponse({ error: "Unauthorized" }, 401);

        const enrollments = getStorageItem("nc_enrollments", []);
        const projects = getStorageItem("nc_projects", []);
        const certs = getStorageItem("nc_certifications", []);

        const activeProjects = projects.filter(p => p.status === "active");
        const completedProjects = projects.filter(p => p.status === "completed");

        let avgProgress = 0;
        if (projects.length > 0) {
          avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length);
        }

        return mockResponse({
          enrolledCount: enrollments.length,
          projectsCount: projects.length,
          activeCount: activeProjects.length,
          completedCount: completedProjects.length,
          certificationsCount: certs.length,
          averageProgress: avgProgress
        });
      }

      // --- MOCK REGISTRATIONS ---
      if (urlString === "/api/registrations") {
        if (method === "POST") {
          return mockResponse({ success: true, registrationId: `reg_${Date.now()}` });
        }
      }

      // --- RESUME UPLOAD MOCKS ---
      if (urlString === "/api/objects/upload") {
        if (method === "POST") {
          return mockResponse({ url: "https://novacrystara-labs.s3.amazonaws.com/temp-resume.pdf" });
        }
      }

      if (urlString === "/api/objects/finalize" || urlString === "/api/objects/finalize") {
        return mockResponse({ success: true });
      }

      // Default error for unhandled mock routes
      return mockResponse({ error: `Mock endpoint ${method} ${urlString} not found` }, 404);
    }

    // Pass through all other URLs to the native fetch
    return originalFetch.apply(this, arguments);
  };
};
