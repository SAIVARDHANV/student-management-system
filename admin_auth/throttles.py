from rest_framework.throttling import SimpleRateThrottle


class AdminLoginRateThrottle(SimpleRateThrottle):
    scope = 'admin_login'

    def get_rate(self):
        return '5/15m'

    def parse_rate(self, rate):
        return 5, 15 * 60

    def get_cache_key(self, request, view):
        return self.cache_format % {
            'scope': self.scope,
            'ident': self.get_ident(request),
        }
