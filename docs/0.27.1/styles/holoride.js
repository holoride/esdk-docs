document.getElementById("year").innerHTML = new Date().getFullYear();

const docsRoot = "/docs";
const versions = window.location.origin + docsRoot + "/.metadata/versions.json";
const localhost = window.location.hostname === "localhost"
const versionDropdownMenu = document.getElementById("versionDropdownMenu");

// From https://semver.org/ | https://regex101.com/r/vkijKf/1/
const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

async function fetchVersions() {
    const response = await fetch(versions);
    return await response.json();
}

if (localhost) {
    appendLocalVersion();
} else {
    fetchVersions()
        .then(versionsJson => {
            const versions = versionsJson.Versions;
            const currentPath = getCurrentPath();
            const currentVersion = getCurrentVersion();
            appendVersions(docsRoot, currentPath, versions);
            setVersionsText(currentVersion, versions);
        })
        .catch(error => {
            console.log(`error:  ${error}`);
        });
}

function appendLocalVersion() {
    let link = document.createElement("a");
    link.setAttribute("href", "#");
    link.innerHTML = "dev";

    let li = document.createElement("li");
    li.appendChild(link);

    versionDropdownMenu.appendChild(li);
    document.getElementById("versionText").innerHTML = "dev";
}

function simplifyVersion(version) {
    const match = version.match(semverRegex);
    if (match === null)
        return version;
    const major = match[1];
    const minor = match[2];
    const prerelease = match[4];
    let result = major + "." + minor;
    if (prerelease) {
        const lastDotIndex = prerelease.lastIndexOf(".");
        if (lastDotIndex >= 0) {
            result += "-" + prerelease.substring(0, lastDotIndex);
        } else {
            result += "-" + prerelease;
        }
    }
    return result;
}

function getCurrentPath() {
    const pathElements = window.location.pathname.split("/");
    return pathElements.slice(3).join("/");
}

function getCurrentVersion() {
    return window.location.pathname.split("/")[2];
}

function appendVersions(rootPath, currentPath, versions) {
    // Don't rely on order in versions.json, sort the simplified versions.
    // Also sort in reverse so that the newest version is on top (same as
    // with Unity documentation for example).
    const simpleVersions = Object.keys(versions).sort().reverse();
    for (let i = 0; i < simpleVersions.length; i++) {
        const simpleVersion = simpleVersions[i];
        const semanticVersion = versions[simpleVersion].SemanticVersion;

        const url = `${rootPath}/${simpleVersion}/${currentPath}`;

        let link = document.createElement("a");
        link.setAttribute("href", url);
        link.innerHTML = simplifyVersion(semanticVersion);

        let li = document.createElement("li");
        li.appendChild(link);

        versionDropdownMenu.appendChild(li);

        if (i < simpleVersions.length - 1) {
            appendDivider(versionDropdownMenu);
        }
    }
}

function appendDivider(menu) {
    let divider = document.createElement("li");
    divider.setAttribute("role", "separator");
    divider.setAttribute("class", "divider");

    menu.appendChild(divider);
}

function setVersionsText(currentVersion, versions) {
    const info = versions[currentVersion];
    if (!info) {
        document.getElementById("versionText").innerHTML = simplifyVersion(getCurrentVersion(currentVersion));
    } else {
        document.getElementById("versionText").innerHTML = info.SemanticVersion;
    }
}
