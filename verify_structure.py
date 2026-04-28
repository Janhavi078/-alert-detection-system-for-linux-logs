#!/usr/bin/env python3
"""
Repository Structure Verification Script
Verifies that all required files exist and have content
"""

import os
import sys
from pathlib import Path

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def check_file_exists(path, description=""):
    """Check if a file exists and report"""
    exists = os.path.isfile(path)
    size = os.path.getsize(path) if exists else 0
    status = f"{GREEN}✅{RESET}" if exists else f"{RED}❌{RESET}"
    
    size_str = f" ({size} bytes)" if size > 0 else ""
    desc = f" - {description}" if description else ""
    
    print(f"  {status} {path}{desc}{size_str}")
    return exists

def check_directory_exists(path, description=""):
    """Check if a directory exists"""
    exists = os.path.isdir(path)
    status = f"{GREEN}✅{RESET}" if exists else f"{RED}❌{RESET}"
    desc = f" - {description}" if description else ""
    
    print(f"  {status} {path}/{desc}")
    return exists

def main():
    """Main verification function"""
    print(f"\n{BLUE}{'='*70}{RESET}")
    print(f"{BLUE}📋 REPOSITORY STRUCTURE VERIFICATION{RESET}")
    print(f"{BLUE}{'='*70}{RESET}\n")
    
    # Get root directory
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)
    
    all_passed = True
    
    # Check ml-service structure
    print(f"{YELLOW}🤖 ML SERVICE STRUCTURE{RESET}")
    ml_checks = [
        ("ml-service/main.py", "FastAPI entry point"),
        ("ml-service/requirements.txt", "Python dependencies"),
        ("ml-service/.env", "Configuration"),
        ("ml-service/.env.example", "Config template"),
        ("ml-service/.gitignore", "Git ignore"),
        ("ml-service/.instructions.md", "Copilot prompt"),
        ("ml-service/README.md", "ML documentation"),
        ("ml-service/models/__init__.py", "Models package"),
        ("ml-service/models/isolation_forest.py", "Isolation Forest model"),
        ("ml-service/models/predictor.py", "Prediction pipeline"),
        ("ml-service/utils/__init__.py", "Utils package"),
        ("ml-service/utils/preprocessor.py", "Log preprocessing"),
        ("ml-service/utils/feature_extractor.py", "Feature engineering"),
        ("ml-service/tests/__init__.py", "Tests package"),
        ("ml-service/tests/test_predictor.py", "Unit tests"),
    ]
    
    for file_path, desc in ml_checks:
        if not check_file_exists(file_path, desc):
            all_passed = False
    
    # Check ml-service directories
    if not check_directory_exists("ml-service/data", "Model storage"):
        all_passed = False
    
    print()
    
    # Check server structure
    print(f"{YELLOW}🧠 NODE BACKEND STRUCTURE{RESET}")
    server_checks = [
        ("server/app.js", "Express app"),
        ("server/server.js", "Server entry point"),
        ("server/services/mlService.js", "ML service client"),
        ("server/routes/mlRoutes.js", "ML API routes"),
    ]
    
    for file_path, desc in server_checks:
        if not check_file_exists(file_path, desc):
            all_passed = False
    
    print()
    
    # Check documentation
    print(f"{YELLOW}📚 DOCUMENTATION{RESET}")
    doc_checks = [
        ("README.md", "Main documentation"),
        ("RUN.md", "Quick start commands"),
        ("SETUP_GUIDE.md", "Setup guide"),
        ("DEPLOYMENT_CHECKLIST.md", "Deployment checklist"),
        ("DEVELOPER_REFERENCE.md", "Developer reference"),
        ("ML_SERVICE_SUMMARY.md", "ML implementation"),
        ("COPILOT_PROMPT_GUIDE.md", "GitHub Copilot guide"),
        ("INDEX.md", "Master index"),
    ]
    
    for file_path, desc in doc_checks:
        if not check_file_exists(file_path, desc):
            all_passed = False
    
    print()
    
    # Summary
    print(f"{BLUE}{'='*70}{RESET}")
    if all_passed:
        print(f"{GREEN}✅ ALL CHECKS PASSED - Repository structure is correct!{RESET}")
        print(f"{BLUE}{'='*70}{RESET}\n")
        print(f"{GREEN}Next Steps:{RESET}")
        print(f"  1. Read: {YELLOW}RUN.md{RESET}")
        print(f"  2. Follow quick start commands")
        print(f"  3. Open: {YELLOW}http://localhost:5173{RESET}")
        print()
        return 0
    else:
        print(f"{RED}❌ SOME CHECKS FAILED - Check missing files above{RESET}")
        print(f"{BLUE}{'='*70}{RESET}\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
