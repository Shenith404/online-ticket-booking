@echo off
echo 🔄 Refreshing dependencies...

echo Removing node_modules...
rmdir /s /q node_modules 2>nul

echo Removing package-lock.json...
del package-lock.json 2>nul

echo Installing dependencies...
npm install

echo ✅ Dependencies refreshed!
echo.
echo You can now run: npm run dev

pause
