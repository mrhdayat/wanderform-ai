from playwright.sync_api import sync_playwright

def verify_responsive():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile: iPhone X (375x812)
        # Tablet: iPad (768x1024)

        # Test Mobile
        print("Testing Mobile (375x812)...")
        context_mobile = browser.new_context(viewport={"width": 375, "height": 812})
        page_mobile = context_mobile.new_page()

        page_mobile.goto("http://localhost:3000")
        page_mobile.screenshot(path="verification/resp_mobile_1_landing.png")

        page_mobile.click("text=Start Planning")
        page_mobile.wait_for_selector("textarea")
        page_mobile.fill("textarea", "Bali 6 days")
        page_mobile.wait_for_timeout(1000) # Wait for chips logic
        page_mobile.screenshot(path="verification/resp_mobile_2_input.png")

        page_mobile.click("text=Generate Journey")

        try:
            # Wait for "Your Journey" which is the new title
            page_mobile.wait_for_selector("text=Your Journey", timeout=20000)
            page_mobile.wait_for_timeout(2000) # Entrance animation
            page_mobile.screenshot(path="verification/resp_mobile_3_dashboard_timeline.png")

            # Toggle Map: The button is visible on small screens (lg:hidden)
            # Find the button in header (it's the first button with map icon usually)
            # Alternatively, select by aria-label or just try the first button in header
            # Button has onClick handler and contains <Map /> icon
            # It's inside header div > div (flex items-center gap-3) > button
            # Let's target by svg class
            map_btn = page_mobile.locator("header button svg.lucide-map").first
            if map_btn.is_visible():
                map_btn.click()
                page_mobile.wait_for_timeout(1000) # Transition
                page_mobile.screenshot(path="verification/resp_mobile_4_dashboard_map.png")
                # Close map (it becomes ArrowLeft)
                # close_btn = page_mobile.locator("header button svg.lucide-arrow-left").first
                # close_btn.click()
            else:
                print("Mobile map toggle button not found/visible.")
        except Exception as e:
            print(f"Mobile dashboard failed: {e}")
            page_mobile.screenshot(path="verification/resp_mobile_fail.png")

        context_mobile.close()

        # Test Tablet
        print("Testing Tablet (768x1024)...")
        context_tablet = browser.new_context(viewport={"width": 768, "height": 1024})
        page_tablet = context_tablet.new_page()

        page_tablet.goto("http://localhost:3000")
        page_tablet.click("text=Start Planning")
        page_tablet.fill("textarea", "Bali 6 days")
        page_tablet.click("text=Generate Journey")

        try:
            page_tablet.wait_for_selector("text=Your Journey", timeout=20000)
            page_tablet.wait_for_timeout(2000)
            page_tablet.screenshot(path="verification/resp_tablet_3_dashboard.png")
        except Exception as e:
            print(f"Tablet dashboard failed: {e}")

        context_tablet.close()
        browser.close()

if __name__ == "__main__":
    verify_responsive()
