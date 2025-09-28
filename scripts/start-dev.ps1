# scripts/start-dev.ps1
# Goal: replicate `bindings=$(./bindings.sh); wrangler pages dev ./build/client $bindings` on Windows.

# If you really have a bash helper, call it and capture the flags it prints:
$bindingsOutput = & bash -lc "./bindings.sh"  # expects it to print: --binding KEY=VAL --binding FOO=BAR ...

# Split into an array of tokens so PowerShell doesn’t pass it as one big string
$bindingArgs = @()
if ($bindingsOutput) {
  $bindingArgs = $bindingsOutput -split '\s+'
}

# Run wrangler with splatted args
wrangler pages dev ./build/client @bindingArgs
