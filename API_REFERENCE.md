# WhisperLab API Reference

## Overview
WhisperLab provides a comprehensive REST API for programmatic access to hardware security experiments, trace management, attack execution, and analysis. The API is built with FastAPI and follows RESTful principles.

## Base URL
All API endpoints are available at: `https://your-whisperlab-instance.com/api/v1`

## Authentication
API authentication uses JWT tokens. Include your token in the `Authorization` header:
```
Authorization: Bearer your-jwt-token-here
```

## API Endpoints by Category

### Experiments

#### Get All Experiments
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/experiments" \
  -H "Authorization: Bearer your-token"
```

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "exp_123",
      "name": "AES CPA Analysis",
      "description": "Correlation Power Analysis on AES implementation",
      "type": "power_analysis",
      "status": "active",
      "created_at": "2024-07-25T10:30:00Z",
      "updated_at": "2024-07-25T10:30:00Z",
      "device_type": "chipwhisperer-lite",
      "parameters": {
        "plaintext_length": 16,
        "key_byte": 0
      }
    }
  ]
}
```

#### Create New Experiment
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/experiments" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New AES Analysis",
    "description": "Analysis of AES implementation",
    "type": "power_analysis",
    "device_type": "chipwhisperer-lite",
    "parameters": {
      "plaintext_length": 32,
      "key_bytes": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    }
  }'
```

#### Get Experiment Details
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/experiments/exp_123" \
  -H "Authorization: Bearer your-token"
```

#### Update Experiment
```bash
curl -X PUT "https://your-whisperlab-instance.com/api/v1/experiments/exp_123" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated AES Analysis",
    "parameters": {
      "plaintext_length": 64
    }
  }'
```

#### Delete Experiment
```bash
curl -X DELETE "https://your-whisperlab-instance.com/api/v1/experiments/exp_123" \
  -H "Authorization: Bearer your-token"
```

### Traces

#### Upload Traces
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/traces/experiment/exp_123/upload" \
  -H "Authorization: Bearer your-token" \
  -F "file=@traces.csv" \
  -F "metadata={"key_byte": 0, "trace_set": "aes_round_1"}"
```

#### Get Trace Metadata
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/traces/exp_123/metadata" \
  -H "Authorization: Bearer your-token"
```

#### Download Traces
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/traces/exp_123/download?format=csv" \
  -H "Authorization: Bearer your-token" \
  -o traces.csv
```

#### Process Traces
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/traces/exp_123/process" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "processing_type": "preprocessing",
    "parameters": {
      "filter_type": "butterworth",
      "cutoff_frequency": 0.1
    }
  }'
```

### Attacks

#### Start Attack
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/attacks" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "experiment_id": "exp_123",
    "attack_type": "cpa",
    "configuration": {
      "hamming_weight_model": true,
      "key_byte": 0,
      "trace_count": 1000,
      "confidence_threshold": 0.95
    }
  }'
```

#### Get Attack Status
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/attacks/atk_456/status" \
  -H "Authorization: Bearer your-token"
```

#### Cancel Attack
```bash
curl -X DELETE "https://your-whisperlab-instance.com/api/v1/attacks/atk_456" \
  -H "Authorization: Bearer your-token"
```

#### Get Attack Results
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/attacks/atk_456/results" \
  -H "Authorization: Bearer your-token" \
  -o attack_results.json
```

### Targets

#### Get All Targets
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/targets" \
  -H "Authorization: Bearer your-token"
```

#### Connect Target
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/targets/connect" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "CW-LITE-001",
    "target_type": "aes_chip",
    "configuration": {
      "clock_frequency": 7370000,
      "voltage_level": 3300
    }
  }'
```

#### Flash Firmware
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/targets/flash" \
  -H "Authorization: Bearer your-token" \
  -F "firmware=@new_firmware.hex" \
  -F "target_id=CW-LITE-001"
```

### Reports

#### Generate Report
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/reports" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "experiment_id": "exp_123",
    "report_type": "pdf",
    "template": "comprehensive_analysis",
    "format_options": {
      "include_traces": true,
      "include_results": true,
      "include_metadata": true
    }
  }'
```

#### Get Report Status
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/reports/report_789/status" \
  -H "Authorization: Bearer your-token"
```

#### Download Report
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/reports/report_789/download?format=pdf" \
  -H "Authorization: Bearer your-token" \
  -o security_report.pdf
```

### Users

#### Get User Profile
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/users/profile" \
  -H "Authorization: Bearer your-token"
```

#### Update User Settings
```bash
curl -X PUT "https://your-whisperlab-instance.com/api/v1/users/settings" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "notifications": true,
    "language": "en"
  }'
```

## Error Responses

The API returns consistent error responses in the following format:

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_INPUT",
    "message": "The request payload is invalid",
    "details": "Missing required field: 'parameters'"
  },
  "timestamp": "2024-07-25T10:30:00Z"
}
```

## Common Error Codes

- `INVALID_INPUT`: Invalid request payload or parameters
- `UNAUTHORIZED`: Invalid or missing authentication token
- `FORBIDDEN`: Insufficient permissions for the requested operation
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `TIMEOUT`: Operation timed out
- `INTERNAL_ERROR`: Internal server error

## WebSocket API

WhisperLab also provides real-time updates via WebSocket connections:

### Connection
```bash
ws://your-whisperlab-instance.com/ws/updates
```

### Subscribe to Experiment Updates
```javascript
const ws = new WebSocket('ws://your-whisperlab-instance.com/ws/updates');

ws.onopen = function() {
  ws.send(JSON.stringify({
    "type": "subscribe",
    "channels": ["experiment:exp_123", "attack:atk_456"]
  }));
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Update received:', data);
};
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Standard tier**: 100 requests per minute
- **Professional tier**: 1000 requests per minute
- **Enterprise tier**: Unlimited requests

Rate limit information is returned in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 60
```

## API Versioning

The API is versioned to ensure backward compatibility:
- **Current version**: v1
- **Base URL**: `/api/v1`

Future versions will be implemented with backward-compatible changes:
- **Major version changes** (v2, v3) will introduce breaking changes
- **Minor version changes** (v1.1, v1.2) will add new features
- **Patch version changes** (v1.0.1, v1.0.2) will fix bugs

## API Testing

### Test Client
You can use the built-in test client for local testing:

```bash
# Start the application
make dev

# Test endpoints with curl
curl -X GET "http://localhost:8000/api/v1/experiments"
```

### Postman's API Collection
Download the Postman collection for API testing:
- URL: `https://api.whisperlab.dev/postman/collection.json`
- Contains all API endpoints with pre-configured variables

## SDK Availability

Official SDKs are available for popular programming languages:

### Python SDK
```bash
pip install whisperlab-sdk
```

```python
from whisperlab import WhisperLabClient

# Initialize client
client = WhisperLabClient(
    base_url="https://your-whisperlab-instance.com",
    api_key="your-api-key"
)

# Create experiment
experiment = client.experiments.create(
    name="My AES Analysis",
    type="power_analysis"
)

# Start attack
attack = client.attacks.start(
    experiment_id=experiment.id,
    attack_type="cpa"
)
```

### JavaScript SDK
```bash
npm install @whisperlab/sdk
```

```javascript
import { WhisperLab } from '@whisperlab/sdk';

// Initialize client
const client = new WhisperLab({
  baseURL: 'https://your-whisperlab-instance.com',
  apiKey: 'your-api-key'
});

// Create experiment
const experiment = await client.experiments.create({
  name: 'My AES Analysis',
  type: 'power_analysis'
});

// Start attack
const attack = await client.attacks.start({
  experimentId: experiment.id,
  attackType: 'cpa'
});
```

## API Documentation OpenAPI Spec

The complete OpenAPI specification is available at:
- **JSON**: `https://your-whisperlab-instance.com/api/v1/openapi.json`
- **Swagger UI**: `https://your-whisperlab-instance.com/api/v1/docs`
- **ReDoc**: `https://your-whisperlab-instance.com/api/v1/redoc`

## API Response Format

All successful responses follow this structure:

```json
{
  "status": "success",
  "data": { /* response data */ },
  "metadata": {
    "timestamp": "2024-07-25T10:30:00Z",
    "request_id": "req_123456",
    "version": "v1.0.0"
  }
}
```

All error responses follow this structure:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  },
  "metadata": {
    "timestamp": "2024-07-25T10:30:00Z",
    "request_id": "req_123456",
    "version": "v1.0.0"
  }
}
```

## API Key Management

### Generate API Key
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/users/api-keys" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Integration",
    "permissions": ["experiments:read", "traces:write", "attacks:execute"],
    "expires_in_days": 30
  }'
```

### List API Keys
```bash
curl -X GET "https://your-whisperlab-instance.com/api/v1/users/api-keys" \
  -H "Authorization: Bearer your-token"
```

### Revoke API Key
```bash
curl -X DELETE "https://your-whisperlab-instance.com/api/v1/users/api-keys/key_123" \
  -H "Authorization: Bearer your-token"
```

## Webhooks

WhisperLab supports webhook integration for real-time event notifications:

### Configure Webhook
```bash
curl -X POST "https://your-whisperlab-instance.com/api/v1/webhooks" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-webhook-endpoint.com/whisperlab",
    "events": ["experiment.created", "attack.started", "attack.completed"],
    "secret": "your-webhook-secret"
  }'
```

### Webhook Event Structure
```json
{
  "event": "attack.completed",
  "data": {
    "attack_id": "atk_456",
    "experiment_id": "exp_123",
    "results": {
      "key_rank": [0.98, 0.95, 0.92, ...],
      "confidence": 0.99
    }
  },
  "timestamp": "2024-07-25T10:35:00Z"
}
```

## API Limits and Quotas

### Default Limits
- **Requests per minute**: 100
- **Storage per user**: 10GB
- **Trace upload size**: 100MB per file
- **Concurrent experiments**: 10
- **Storage per experiment**: 1GB

### Upgrade Options
- **Professional**: 1000 requests/min, 100GB storage, 1GB/experiment
- **Enterprise**: Unlimited requests, 1TB storage, 10GB/experiment

Upgrade your plan through the WhisperLab dashboard.

## API Changelog

### v1.0.0 (Initial Release)
- Full REST API with all core functionality
- JWT authentication
- WebSocket real-time updates
- Python and JavaScript SDKs
- OpenAPI documentation
- Rate limiting

### v1.0.1 (Bug Fixes)
- Fixed authentication token expiration
- Improved error messages
- Added pagination for large result sets

### v1.1.0 (New Features)
- Added webhook support
- Enhanced API key management
- Improved trace processing
- Added real-time analytics

## Support

For API-related issues, contact:
- **Technical Support**: api-support@whisperlab.dev
- **Documentation**: docs@whisperlab.dev
- **Sales**: sales@whisperlab.dev

---

*Last Updated*: $(date -u +%Y-%m-%d)
*Version*: v1.1.0

*(End of API Reference)*