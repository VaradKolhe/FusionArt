# FusionArt Services Launcher with Port Cleanup
$rootPath = Get-Location
$backendPort = 8085
$frontendPort = 5173

function Stop-PortProcess($port) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -First 1
    if ($process) {
        Write-Host "Cleaning up port $port (PID: $process)..." -ForegroundColor Gray
        Stop-Process -Id $process -Force -ErrorAction SilentlyContinue
    }
}

# 1. Initial Cleanup
Write-Host "---------------------------------------------------" -ForegroundColor Cyan
Write-Host "Performing initial port cleanup..." -ForegroundColor Cyan
Stop-PortProcess $backendPort
Stop-PortProcess $frontendPort

# 2. Check for environment variables
$requiredVars = @("RAZOR_PAY_KEY", "RAZOR_PAY_SECRET", "EMAIL_USERNAME", "EMAIL_PASSWORD")
$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not (Get-Item "Env:$var" -ErrorAction SilentlyContinue)) { $missingVars += $var }
}

if ($missingVars.Count -gt 0) {
    Write-Host "WARNING: Missing environment variables: $($missingVars -join ', ')" -ForegroundColor Yellow
    Write-Host "App will start, but Email/Payments will fail." -ForegroundColor Gray
}

# 3. Launch Services
Write-Host "Launching FusionArt in Windows Terminal..." -ForegroundColor Cyan
if (Get-Command wt -ErrorAction SilentlyContinue) {
    # Launch in tabs
    wt -p "Windows PowerShell" -d "$rootPath\backend" powershell -NoExit -Command ".\mvnw.cmd spring-boot:run" `; `
       new-tab -p "Windows PowerShell" -d "$rootPath\frontend" powershell -NoExit -Command "npm run dev"
} else {
    # Fallback to windows
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\mvnw.cmd spring-boot:run"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
}

Write-Host "---------------------------------------------------" -ForegroundColor Green
Write-Host "SERVICES ARE RUNNING" -ForegroundColor Green
Write-Host "Backend: http://localhost:$backendPort" -ForegroundColor Gray
Write-Host "Frontend: http://localhost:$frontendPort" -ForegroundColor Gray
Write-Host "---------------------------------------------------" -ForegroundColor Green

# 3. Wait for User to Close
Write-Host "IMPORTANT: To shut down and CLEAN UP ports, press any key in THIS window." -ForegroundColor Yellow
Write-Host "Do not just close the terminal tabs manually if you want automatic cleanup." -ForegroundColor DarkGray

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# 4. Final Cleanup
Write-Host "`nShutting down services..." -ForegroundColor Red
Stop-PortProcess $backendPort
Stop-PortProcess $frontendPort

Write-Host "Cleanup complete. Goodbye!" -ForegroundColor Cyan
Sleep 2
