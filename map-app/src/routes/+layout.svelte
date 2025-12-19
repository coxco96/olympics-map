<script>
    import {
        Collapse,
        NavbarToggler,
        NavbarBrand,
        Nav,
        Navbar,
        NavItem,
        NavLink,
        Dropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem,
    } from "@sveltestrap/sveltestrap";

    // import github from "$lib/images/github.svg";

    import "bootstrap-icons/font/bootstrap-icons.css";
    let isOpen = false;

    function handleUpdate(event) {
        isOpen = event.detail.isOpen;
    }
</script>

<Navbar color="light" light expand="md" container="md" class="py-2">
    <!-- Left: Site title -->
    <NavbarBrand href="/" class="me-auto">
        <h1 class="h5 mb-0">Olympics Map</h1>
    </NavbarBrand>

    <!-- Right: Icon links -->
    <Nav class="ms-auto navbar-nav flex-row align-items-center" navbar>
        <NavItem class="ms-3">
            <NavLink
                href="https://github.com/coxco96/olympics-map/"
                aria-label="View the code behind this site"
                title="View Site Code"
            >
                <i class="bi bi-github" style="font-size:20px;"></i>
            </NavLink>
        </NavItem>
        <NavItem class="ms-3">
            <NavLink href="./notes" aria-label="View site notes" title="Notes">
                <i class="bi bi-info-circle" style="font-size:20px;"></i>
            </NavLink>
        </NavItem>
    </Nav>
</Navbar>

<slot />
