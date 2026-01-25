"""
RAG Content Loader
Loads website content from JSON configuration files.
"""

import json
import os
from typing import Dict, List, Any
from pathlib import Path


class ContentLoader:
    """Loads and parses website content from JSON files."""

    def __init__(self, config_path: str = None):
        if config_path is None:
            # Default path relative to backend directory
            base_dir = Path(__file__).parent.parent.parent
            config_path = base_dir / "config" / "content" / "en"
        self.config_path = Path(config_path)
        self.content: Dict[str, Any] = {}

    def load_all(self) -> Dict[str, Any]:
        """Load all content files."""
        self.content = {
            "services": self._load_services(),
            "it_service": self._load_it_service(),
            "site_config": self._load_site_config(),
            "about": self._load_about(),
            "contact": self._load_contact(),
            "home": self._load_home(),
        }
        return self.content

    def _load_json(self, filename: str) -> Dict[str, Any]:
        """Load a JSON file safely."""
        filepath = self.config_path / filename
        if filepath.exists():
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def _load_services(self) -> Dict[str, Any]:
        """Load services.json containing all service content."""
        return self._load_json("services.json")

    def _load_it_service(self) -> Dict[str, Any]:
        """Load it-service.json for additional IT content."""
        return self._load_json("it-service.json")

    def _load_site_config(self) -> Dict[str, Any]:
        """Load site-config.json for organization info."""
        site_config_path = self.config_path.parent.parent / "site-config.json"
        if site_config_path.exists():
            with open(site_config_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def _load_about(self) -> Dict[str, Any]:
        """Load about.json."""
        return self._load_json("about.json")

    def _load_contact(self) -> Dict[str, Any]:
        """Load contact.json."""
        return self._load_json("contact.json")

    def _load_home(self) -> Dict[str, Any]:
        """Load home.json."""
        return self._load_json("home.json")

    def get_service_content(self, service: str) -> Dict[str, Any]:
        """Get content for a specific service."""
        if not self.content:
            self.load_all()

        services = self.content.get("services", {})
        return services.get(service, {})

    def get_all_services(self) -> List[str]:
        """Get list of all available services."""
        if not self.content:
            self.load_all()

        services = self.content.get("services", {})
        return list(services.keys())
