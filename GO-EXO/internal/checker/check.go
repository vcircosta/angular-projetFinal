package checker

import (
	"fmt"
	"net/http"
	"time"
)

type CheckResult struct {
	Target string
	Status string
	Err    error
}

func CheckURL(url string, result chan<- CheckResult) {
	client := http.Client{
		Timeout: 3 * time.Second,
	}
	resp, err := client.Get(url)
	if err != nil {
		result <- CheckResult{
			Target: url,
			Status: "unreachable",
			Err:    fmt.Errorf("Request failed: %w", err),
		}
		return
	}
	defer resp.Body.Close()

	result <- CheckResult{
		Target: url,
		Status: resp.Status,
	}
}
