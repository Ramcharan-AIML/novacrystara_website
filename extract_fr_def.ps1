$content = Get-Content -Raw -Path "downloads/index.js" -Encoding utf8
$results = New-Object System.Collections.Generic.List[string]

# Search for the string "function Fr(" or "const Fr =" or "let Fr =" or similar
# Let's search for matches using regex
$pattern = '(?:\bFr\s*=\s*|function\s+Fr\b)'
$matches = [regex]::Matches($content, $pattern)
foreach ($m in $matches) {
    $idx = $m.Index
    $start = [Math]::Max(0, $idx - 200)
    $end = [Math]::Min($content.Length - 1, $idx + 200)
    $results.Add("MATCH at index $idx : " + $m.Value)
    $results.Add($content.Substring($start, $end - $start))
    $results.Add("-" * 80)
}

$results | Out-File -FilePath "extracted_fr_def.txt" -Encoding utf8
Write-Host "Done!"
