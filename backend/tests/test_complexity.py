import pytest
from app.utils.complexity import calculate_complexity

def test_complexity_simple():
    diff_text = """diff --git a/test.py b/test.py
--- a/test.py
+++ b/test.py
@@ -1,2 +1,3 @@
 def test():
+    if True:
+        print("hello")
"""
    result = calculate_complexity(diff_text)
    assert result.decision_points == 2 # 1 base + 1 if
    assert "test.py" in result.file_breakdown

def test_complexity_complex():
    diff_text = """diff --git a/test.js b/test.js
--- a/test.js
+++ b/test.js
@@ -1,2 +1,6 @@
 function test() {
+    if (a && b) {
+        for (let i = 0; i < 10; i++) {}
+    }
+    return a || b ? 1 : 0;
 }
"""
    result = calculate_complexity(diff_text)
    # Decisions: 1 base + if + && + for + || + ? = 6
    assert result.decision_points == 6
    assert "test.js" in result.file_breakdown
