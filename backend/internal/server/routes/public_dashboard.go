package routes

import (
	"github.com/Wei-Shaw/sub2api/internal/handler"

	"github.com/gin-gonic/gin"
)

// RegisterPublicDashboardRoutes registers anonymous dashboard routes keyed by API key suffix.
func RegisterPublicDashboardRoutes(v1 *gin.RouterGroup, h *handler.Handlers) {
	public := v1.Group("/public/dashboard")
	{
		public.GET("/:suffix/stats", h.Usage.PublicDashboardStats)
		public.GET("/:suffix/trend", h.Usage.PublicDashboardTrend)
		public.GET("/:suffix/models", h.Usage.PublicDashboardModels)
		public.GET("/:suffix/recent", h.Usage.PublicDashboardRecentUsage)
	}
}
