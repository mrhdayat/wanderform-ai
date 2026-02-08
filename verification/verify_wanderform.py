from playwright.sync_api import sync_playwright

def run():
    print("Launching browser...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a desktop viewport to ensure elements are visible
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # 1. Landing
        print("Navigating to landing...")
        page.goto("http://localhost:3000")
        # Updated selector for the redesign text
        page.wait_for_selector("text=Plan your journey")
        page.screenshot(path="verification/1_landing.png")
        print("Captured landing.")

        # 2. Start
        print("Clicking start...")
        page.click("text=Start Planning")
        page.wait_for_selector("textarea")
        page.wait_for_timeout(500)
        page.screenshot(path="verification/2_input.png")
        print("Captured input screen.")

        # 3. Input
        print("Entering prompt...")
        page.fill("textarea", "I want to go to Bali for 6 days with a budget of 7 million")
        page.wait_for_timeout(1000) # Wait for chips logic
        page.screenshot(path="verification/3_input_filled.png")
        print("Captured filled input.")

        # 4. Generate
        print("Generating...")
        page.click("text=Generate Journey")

        # 5. Thinking
        # Wait for "Understanding your travel style"
        try:
            page.wait_for_selector("text=Understanding your travel style", timeout=5000)
            page.screenshot(path="verification/4_thinking.png")
            print("Captured thinking state.")
        except:
            print("Thinking state skipped too fast or not found.")

        # 6. Dashboard
        print("Waiting for dashboard (Bali)...")
        # Wait for "Bali, Indonesia" which is in the header on desktop
        page.wait_for_selector("text=Bali, Indonesia", timeout=15000)
        page.wait_for_timeout(2000) # Wait for entrance animations
        page.screenshot(path="verification/5_dashboard.png")
        print("Captured dashboard.")

        browser.close()

if __name__ == "__main__":
    run()
