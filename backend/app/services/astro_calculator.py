from typing import Dict, Any, Optional
from datetime import datetime, date
import logging

try:
    from kerykeion import AstrologicalSubject
    KERYKEION_AVAILABLE = True
except ImportError:
    KERYKEION_AVAILABLE = False
    logger = logging.getLogger(__name__)
    logger.warning("kerykeion not installed, using mock calculations")

logger = logging.getLogger(__name__)


class AstroCalculatorService:
    """Service for astrological calculations using kerykeion."""

    @staticmethod
    def _get_planet_data(subject, planet_name: str) -> Dict[str, Any]:
        """Extract planet data from subject."""
        try:
            planet = getattr(subject, planet_name)
            return {
                "sign": planet.get("sign", "Unknown"),
                "position": planet.get("position", 0.0),
                "house": planet.get("house", "Unknown"),
                "retrograde": planet.get("retrograde", False),
                "abs_pos": planet.get("abs_pos", 0.0)
            }
        except Exception as e:
            logger.error(f"Error extracting {planet_name}: {str(e)}")
            return {
                "sign": "Unknown",
                "position": 0.0,
                "house": "Unknown",
                "retrograde": False,
                "abs_pos": 0.0
            }

    @staticmethod
    def generate_natal_chart(
        birth_date: date,
        birth_time: str,  # HH:MM format
        birth_latitude: float,
        birth_longitude: float,
        birth_city: str,
        birth_timezone: str
    ) -> Dict[str, Any]:
        """
        Generate a complete natal chart.

        Returns a dict with planets, houses, and aspects.
        """
        if not KERYKEION_AVAILABLE:
            # Return mock data for testing
            return AstroCalculatorService._generate_mock_chart(birth_date, birth_time)

        try:
            # Parse birth time
            hour, minute = map(int, birth_time.split(":"))

            # Create astrological subject
            subject = AstrologicalSubject(
                name="Subject",
                year=birth_date.year,
                month=birth_date.month,
                day=birth_date.day,
                hour=hour,
                minute=minute,
                city=birth_city,
                nation="",  # kerykeion handles this differently
                lat=birth_latitude,
                lng=birth_longitude,
                tz_str=birth_timezone
            )

            # Extract planets data
            planets = {
                "sun": AstroCalculatorService._get_planet_data(subject, "sun"),
                "moon": AstroCalculatorService._get_planet_data(subject, "moon"),
                "mercury": AstroCalculatorService._get_planet_data(subject, "mercury"),
                "venus": AstroCalculatorService._get_planet_data(subject, "venus"),
                "mars": AstroCalculatorService._get_planet_data(subject, "mars"),
                "jupiter": AstroCalculatorService._get_planet_data(subject, "jupiter"),
                "saturn": AstroCalculatorService._get_planet_data(subject, "saturn"),
                "uranus": AstroCalculatorService._get_planet_data(subject, "uranus"),
                "neptune": AstroCalculatorService._get_planet_data(subject, "neptune"),
                "pluto": AstroCalculatorService._get_planet_data(subject, "pluto"),
                "north_node": AstroCalculatorService._get_planet_data(subject, "mean_node"),
                "ascendant": {
                    "sign": subject.first_house.get("sign", "Unknown"),
                    "position": subject.first_house.get("position", 0.0),
                    "abs_pos": subject.first_house.get("abs_pos", 0.0)
                },
                "midheaven": {
                    "sign": subject.tenth_house.get("sign", "Unknown"),
                    "position": subject.tenth_house.get("position", 0.0),
                    "abs_pos": subject.tenth_house.get("abs_pos", 0.0)
                }
            }

            # Extract houses data
            houses = []
            house_names = ["first", "second", "third", "fourth", "fifth", "sixth",
                          "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]

            for i, house_name in enumerate(house_names, 1):
                try:
                    house_attr = f"{house_name}_house"
                    house_data = getattr(subject, house_attr, {})
                    houses.append({
                        "house": i,
                        "sign": house_data.get("sign", "Unknown"),
                        "position": house_data.get("position", 0.0),
                        "abs_pos": house_data.get("abs_pos", 0.0)
                    })
                except Exception as e:
                    logger.error(f"Error extracting house {i}: {str(e)}")
                    houses.append({
                        "house": i,
                        "sign": "Unknown",
                        "position": 0.0,
                        "abs_pos": 0.0
                    })

            # Get aspects
            aspects = []
            try:
                if hasattr(subject, 'aspects_list') and subject.aspects_list:
                    for aspect in subject.aspects_list:
                        aspects.append({
                            "planet1": aspect.get("p1_name", "Unknown"),
                            "planet2": aspect.get("p2_name", "Unknown"),
                            "aspect": aspect.get("aspect", "Unknown"),
                            "orb": aspect.get("orbit", 0.0),
                            "applying": aspect.get("aid", 0) < 0
                        })
            except Exception as e:
                logger.error(f"Error extracting aspects: {str(e)}")

            return {
                "planets": planets,
                "houses": houses,
                "aspects": aspects,
                "calculation_date": datetime.utcnow().isoformat()
            }

        except Exception as e:
            logger.error(f"Error generating natal chart: {str(e)}")
            raise ValueError(f"Failed to generate natal chart: {str(e)}")

    @staticmethod
    def _generate_mock_chart(birth_date: date, birth_time: str) -> Dict[str, Any]:
        """Generate mock chart data for testing when kerykeion is not available."""
        return {
            "planets": {
                "sun": {"sign": "Leo", "position": 15.5, "house": "5", "retrograde": False, "abs_pos": 135.5},
                "moon": {"sign": "Cancer", "position": 23.2, "house": "4", "retrograde": False, "abs_pos": 113.2},
                "mercury": {"sign": "Virgo", "position": 10.0, "house": "6", "retrograde": False, "abs_pos": 160.0},
                "venus": {"sign": "Libra", "position": 5.3, "house": "7", "retrograde": False, "abs_pos": 185.3},
                "mars": {"sign": "Aries", "position": 28.7, "house": "1", "retrograde": False, "abs_pos": 28.7},
                "jupiter": {"sign": "Sagittarius", "position": 12.4, "house": "9", "retrograde": False, "abs_pos": 252.4},
                "saturn": {"sign": "Capricorn", "position": 8.9, "house": "10", "retrograde": False, "abs_pos": 278.9},
                "uranus": {"sign": "Aquarius", "position": 3.1, "house": "11", "retrograde": False, "abs_pos": 303.1},
                "neptune": {"sign": "Pisces", "position": 18.6, "house": "12", "retrograde": False, "abs_pos": 348.6},
                "pluto": {"sign": "Scorpio", "position": 25.2, "house": "8", "retrograde": False, "abs_pos": 235.2},
                "north_node": {"sign": "Gemini", "position": 14.8, "house": "3", "retrograde": True, "abs_pos": 74.8},
                "ascendant": {"sign": "Aries", "position": 0.0, "abs_pos": 0.0},
                "midheaven": {"sign": "Capricorn", "position": 0.0, "abs_pos": 270.0}
            },
            "houses": [
                {"house": i, "sign": "Unknown", "position": i * 30.0, "abs_pos": i * 30.0}
                for i in range(1, 13)
            ],
            "aspects": [
                {"planet1": "Sun", "planet2": "Moon", "aspect": "Sextile", "orb": 2.3, "applying": True},
                {"planet1": "Venus", "planet2": "Mars", "aspect": "Opposition", "orb": 3.1, "applying": False}
            ],
            "calculation_date": datetime.utcnow().isoformat(),
            "mock": True
        }

    @staticmethod
    def calculate_transits(
        natal_chart_data: Dict[str, Any],
        transit_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        Calculate current transits against a natal chart.

        Returns active transits with tight orbs.
        """
        if transit_date is None:
            transit_date = datetime.utcnow()

        # This is a simplified implementation
        # In production, you would calculate actual transiting planet positions
        # and compare them to natal positions

        return {
            "transit_date": transit_date.isoformat(),
            "active_transits": [],
            "message": "Transit calculation requires full implementation"
        }

    @staticmethod
    def calculate_synastry(
        chart1_data: Dict[str, Any],
        chart2_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculate synastry (compatibility) between two charts.

        Returns inter-chart aspects and compatibility score.
        """
        # This is a simplified implementation
        # In production, you would calculate inter-chart aspects
        # and generate a compatibility score

        return {
            "compatibility_score": 0,
            "inter_aspects": [],
            "element_balance": {},
            "message": "Synastry calculation requires full implementation"
        }

    @staticmethod
    def generate_chart_svg(chart_data: Dict[str, Any]) -> str:
        """
        Generate SVG representation of the natal chart.

        This is a placeholder - kerykeion has built-in chart generation.
        """
        # In production, use kerykeion's MakeSvgInstance or custom SVG generation
        return "<svg><!-- Chart SVG placeholder --></svg>"
