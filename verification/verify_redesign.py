from playwright.sync_api import sync_playwright

def verify_redesign():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 1440x900 for a nice desktop view
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        # 1. Landing (Check Minimalist Hero)
        print("Capturing Landing...")
        page.goto("http://localhost:3000")
        page.wait_for_selector("text=Plan your journey")
        page.screenshot(path="verification/redesign_1_landing.png")

        # 2. Input (Check Clean Input)
        print("Capturing Input...")
        page.click("text=Start Planning")
        page.wait_for_selector("textarea")
        page.screenshot(path="verification/redesign_2_input.png")

        # 3. Dashboard (Check Cards & Spacing)
        print("Capturing Dashboard...")
        page.fill("textarea", "Bali 6 days")
        page.click("text=Generate Journey")

        try:
            page.wait_for_selector("text=Your Journey", timeout=20000)
            # Wait for animations
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/redesign_3_dashboard.png")
        except Exception as e:
            print(f"Dashboard failed: {e}")
            page.screenshot(path="verification/redesign_fail.png")

        context.close()
        browser.close()

if __name__ == "__main__":
    verify_redesign()
