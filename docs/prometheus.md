---
title: Prometheus metrics
description: How to configure Prometheus to monitor your PiKVM metrics
---

[Prometheus](https://prometheus.io) is one of the popular monitoring
systems. It pulls service's endpoint to get metrics in a [simple text
format](https://prometheus.io/docs/instrumenting/exposition_formats).
PiKVM has the ability to export some information to this system such as
the server's ATX state, Pi's temperature, [GPIO](gpio.md) state and some
other things.


## Configure Prometheus

To enable Prometheus getting metrics from pikvm following [config](https://prometheus.io/docs/prometheus/latest/configuration/configuration) could be used:

```yaml
scrape_configs:
  - job_name: "pikvm"
    metrics_path: "/api/export/prometheus/metrics"
    basic_auth:
      username: admin
      password: admin
    scheme: https
    static_configs:
    - targets: ["pikvm"]
    tls_config:
      insecure_skip_verify: true # For self-signed certificate
```


## Output example

This example includes the [GPIO](gpio.md) from the PiKVM's [test config](https://github.com/pikvm/kvmd/blob/905bcf555f00d191654982cca80e294363efecc1/testenv/v2-hdmi-rpi4.override.yaml#L40).

```bash
$ curl -k -HX-KVMD-User:admin -HX-KVMD-Passwd:admin https://pikvm/api/export/prometheus/metrics

# TYPE pikvm_atx_enabled gauge
pikvm_atx_enabled 1

# TYPE pikvm_atx_power gauge
pikvm_atx_power 0

# TYPE pikvm_gpio_input_online_led1 gauge
pikvm_gpio_input_online_led1 0

# TYPE pikvm_gpio_input_state_led1 gauge
pikvm_gpio_input_state_led1 0

# TYPE pikvm_gpio_input_online_led2 gauge
pikvm_gpio_input_online_led2 0

# TYPE pikvm_gpio_input_state_led2 gauge
pikvm_gpio_input_state_led2 0

# TYPE pikvm_gpio_output_online_button1 gauge
pikvm_gpio_output_online_button1 0

# TYPE pikvm_gpio_output_state_button1 gauge
pikvm_gpio_output_state_button1 0

# TYPE pikvm_gpio_output_online_button2 gauge
pikvm_gpio_output_online_button2 0

# TYPE pikvm_gpio_output_state_button2 gauge
pikvm_gpio_output_state_button2 0

# TYPE pikvm_gpio_output_online_relay1 gauge
pikvm_gpio_output_online_relay1 0

# TYPE pikvm_gpio_output_state_relay1 gauge
pikvm_gpio_output_state_relay1 0

# TYPE pikvm_gpio_output_online_relay2 gauge
pikvm_gpio_output_online_relay2 0

# TYPE pikvm_gpio_output_state_relay2 gauge
pikvm_gpio_output_state_relay2 0

# TYPE pikvm_hw_temp_cpu gauge
pikvm_hw_temp_cpu 36.511

# TYPE pikvm_hw_temp_gpu gauge
pikvm_hw_temp_gpu 35.0

# TYPE pikvm_hw_throttling_freq_capped_now gauge
pikvm_hw_throttling_freq_capped_now 0

# TYPE pikvm_hw_throttling_freq_capped_past gauge
pikvm_hw_throttling_freq_capped_past 0

# TYPE pikvm_hw_throttling_throttled_now gauge
pikvm_hw_throttling_throttled_now 0

# TYPE pikvm_hw_throttling_throttled_past gauge
pikvm_hw_throttling_throttled_past 0

# TYPE pikvm_hw_throttling_undervoltage_now gauge
pikvm_hw_throttling_undervoltage_now 0

# TYPE pikvm_hw_throttling_undervoltage_past gauge
pikvm_hw_throttling_undervoltage_past 0

# TYPE pikvm_hw_throttling_raw_flags gauge
pikvm_hw_throttling_raw_flags 0
* Connection #0 to host localhost left intact
```
