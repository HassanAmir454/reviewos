import pytest
from app.utils.diff_parser import parse_diff

def test_parse_diff_added_file():
    diff_text = """diff --git a/test.py b/test.py
new file mode 100644
index 0000000..e69de29
--- /dev/null
+++ b/test.py
@@ -0,0 +1,2 @@
+def test():
+    pass
"""
    result = parse_diff(diff_text)
    assert len(result) == 1
    assert result[0].filename == "test.py"
    assert result[0].status == "added"
    assert result[0].additions == 2
    assert result[0].deletions == 0

def test_parse_diff_modified_file():
    diff_text = """diff --git a/test.py b/test.py
index e69de29..d95f3ad 100644
--- a/test.py
+++ b/test.py
@@ -1,2 +1,3 @@
 def test():
-    pass
+    print("hello")
+    return True
"""
    result = parse_diff(diff_text)
    assert len(result) == 1
    assert result[0].filename == "test.py"
    assert result[0].status == "modified"
    assert result[0].additions == 2
    assert result[0].deletions == 1
