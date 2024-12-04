import axios from 'axios';
import { CloudFront, ECS, RDS, ElastiCache } from '@aws-sdk/client-sdk';

describe('Infrastructure Tests', () => {
  const API_URL = process.env.API_URL || 'https://api.ecole-moliere.com';
  const APP_URL = process.env.APP_URL || 'https://app.ecole-moliere.com';
  
  describe('Frontend Availability', () => {
    it('should access frontend application', async () => {
      const response = await axios.get(APP_URL);
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    });

    it('should have proper security headers', async () => {
      const response = await axios.get(APP_URL);
      expect(response.headers['strict-transport-security']).toBeDefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should serve static assets from CloudFront', async () => {
      const response = await axios.get(`${APP_URL}/static/js/main.js`);
      expect(response.headers['server']).toBe('CloudFront');
    });
  });

  describe('Backend API Health', () => {
    it('should respond to health check', async () => {
      const response = await axios.get(`${API_URL}/actuator/health`);
      expect(response.status).toBe(200);
      expect(response.data.status).toBe('UP');
    });

    it('should have database connection', async () => {
      const response = await axios.get(`${API_URL}/actuator/health/db`);
      expect(response.data.status).toBe('UP');
      expect(response.data.details.database).toBe('MySQL');
    });

    it('should have Redis connection', async () => {
      const response = await axios.get(`${API_URL}/actuator/health/redis`);
      expect(response.data.status).toBe('UP');
    });
  });

  describe('AWS Services', () => {
    const ecs = new ECS({});
    const rds = new RDS({});
    const elasticache = new ElastiCache({});
    const cloudfront = new CloudFront({});

    it('should have healthy ECS tasks', async () => {
      const response = await ecs.describeServices({
        cluster: 'ecole-moliere-prod',
        services: ['backend', 'frontend']
      });
      
      response.services?.forEach(service => {
        expect(service.runningCount).toBeGreaterThan(0);
        expect(service.status).toBe('ACTIVE');
      });
    });

    it('should have available RDS instance', async () => {
      const response = await rds.describeDBClusters({
        DBClusterIdentifier: 'ecole-moliere-prod'
      });
      
      const cluster = response.DBClusters?.[0];
      expect(cluster?.Status).toBe('available');
      expect(cluster?.Engine).toBe('aurora-mysql');
    });

    it('should have running Redis cluster', async () => {
      const response = await elasticache.describeCacheClusters({
        CacheClusterId: 'ecole-moliere-prod'
      });
      
      const cluster = response.CacheClusters?.[0];
      expect(cluster?.CacheClusterStatus).toBe('available');
      expect(cluster?.Engine).toBe('redis');
    });

    it('should have enabled CloudFront distribution', async () => {
      const response = await cloudfront.getDistribution({
        Id: process.env.CLOUDFRONT_DISTRIBUTION_ID
      });
      
      expect(response.Distribution?.Status).toBe('Deployed');
      expect(response.Distribution?.DistributionConfig?.Enabled).toBe(true);
    });
  });

  describe('Security Configuration', () => {
    it('should enforce HTTPS', async () => {
      try {
        await axios.get(API_URL.replace('https://', 'http://'));
        fail('Should not allow HTTP');
      } catch (error) {
        expect(error.response?.status).toBe(301);
      }
    });

    it('should have valid SSL certificate', async () => {
      const response = await axios.get(API_URL);
      expect(response.request.res.socket.authorized).toBe(true);
    });

    it('should have proper CORS configuration', async () => {
      const response = await axios.options(API_URL);
      expect(response.headers['access-control-allow-origin']).toBe(APP_URL);
      expect(response.headers['access-control-allow-methods']).toContain('GET');
    });
  });

  describe('Performance', () => {
    it('should respond within acceptable time', async () => {
      const start = Date.now();
      await axios.get(API_URL);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000);
    });

    it('should properly cache static assets', async () => {
      const response = await axios.get(`${APP_URL}/static/js/main.js`);
      expect(response.headers['cache-control']).toContain('max-age=31536000');
    });
  });
});
