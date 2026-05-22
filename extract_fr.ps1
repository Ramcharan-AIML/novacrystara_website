$content = Get-Content -Raw -Path "downloads/index.js" -Encoding utf8
$parts = $content.Split('\"')

$results = New-Object System.Collections.Generic.List[string]

# Search for "Fr" definition or usage
for ($i = 0; $i -lt $parts.Length; $i++) {
    $p = $parts[$i]
    if ($p.Contains("Fr") -or $p.Contains("function Fr") -or $p.Contains("const Fr")) {
        if ($p.Length -lt 200) {
            $results.Add("Index " + $i + " : " + $p.Trim())
            # surrounding context
            $start = [Math]::Max(0, $i - 3)
            $end = [Math]::Min($parts.Length - 1, $i + 3)
            for ($j = $start; $j -le $end; $j++) {
                $prefix = if ($j -eq $i) { ">>> " } else { "    " }
                $results.Add($prefix + $parts[$j].Trim())
            }
            $results.Add("-" * 40)
        }
    }
}

$results | Out-File -FilePath "extracted_fr.txt" -Encoding utf8
Write-Host "Done!"
