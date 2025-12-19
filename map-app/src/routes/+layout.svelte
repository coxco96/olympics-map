<script>
    import {
        NavbarBrand,
        Nav,
        Navbar,
        NavItem,
        NavLink,
    } from "@sveltestrap/sveltestrap";
    import "bootstrap-icons/font/bootstrap-icons.css";
</script>

<div class="layout-root">
    <header class="nav-sticky-wrapper">
        <Navbar light expand="md" container="md" class="custom-nav">
            <NavbarBrand href="/" class="brand-link">
                <span class="brand-text">Olympics Map</span>
            </NavbarBrand>

            <Nav class="ms-auto flex-row align-items-center" navbar>
                <NavItem class="ms-3">
                    <NavLink
                        href="https://github.com/coxco96/olympics-map/"
                        class="icon-link"
                        title="Source Code"
                    >
                        <i class="bi bi-github"></i>
                    </NavLink>
                </NavItem>
                <NavItem class="ms-3">
                    <NavLink href="./notes" class="icon-link" title="Notes">
                        <i class="bi bi-info-circle"></i>
                    </NavLink>
                </NavItem>
            </Nav>
        </Navbar>
    </header>

    <main class="content-area">
        <slot />
    </main>
</div>

<style>
    :global(html),
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;
    }

    .layout-root {
        width: 100%;
        min-height: 100vh;
    }

    .nav-sticky-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 2000;
        background-color: rgba(255, 255, 255, 0.75);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .content-area {
        padding-top: 60px; 
    }

    :global(.container),
    :global(.row) {
        overflow: visible !important;
    }

    .brand-text {
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
            sans-serif;
        font-weight: 600;
        font-size: 1.15rem;
        letter-spacing: -0.02em; 
        color: #1d1d1f;
    }

    :global(.icon-link) {
        color: #86868b !important; 
        transition: color 0.2s ease !important;
        display: flex;
        align-items: center;
    }

    :global(.icon-link:hover) {
        color: #1d1d1f !important; 
    }

    :global(.bi) {
        font-size: 1.25rem; 
    }
</style>
