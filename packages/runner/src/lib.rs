#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use std::sync::Arc;
use tokio::sync::mpsc::channel;
use napi::Error;

// use mistralrs::{
//     Constraint, Device, DeviceMapMetadata, MistralRs, MistralRsBuilder, ModelDType,
//     NormalLoaderBuilder, NormalLoaderType, NormalRequest, NormalSpecificConfig, Request,
//     RequestMessage, Response, SamplingParams, SchedulerMethod, TokenSource,
// };

use mistralrs::{
  Constraint, Device, DeviceMapMetadata, GGUFLoaderBuilder, GGUFSpecificConfig, MistralRs,
  MistralRsBuilder, ModelDType, NormalRequest, Request, RequestMessage, Response, SamplingParams,
  SchedulerMethod, TokenSource,
};

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}

// fn setup() -> anyhow::Result<Arc<MistralRs>> {
//   // Select a Mistral model
//   let loader = NormalLoaderBuilder::new(
//       NormalSpecificConfig {
//           use_flash_attn: false,
//           repeat_last_n: 64,
//       },
//       None,
//       Some("TheBloke/Mistral-7B-Instruct-v0.2-GGUF".to_string()),
//       Some("vsevolodl/prometheus-7b-v2.0-GGUF".to_string()),
//   )
//   .build(NormalLoaderType::Mistral);

//   // Load, into a Pipeline
//   let pipeline = loader.load_model_from_hf(
//       None,
//       TokenSource::CacheToken,
//       &ModelDType::Auto,
//       &Device::cuda_if_available(0)?,
//       false,
//       DeviceMapMetadata::dummy(),
//       None,
//   )?;

//   // Create the MistralRs, which is a runner
//   Ok(MistralRsBuilder::new(pipeline, SchedulerMethod::Fixed(5.try_into().unwrap())).build())
// }



fn setup() -> anyhow::Result<Arc<MistralRs>> {
  // Select a Mistral model
  // We do not use any files from HF servers here, and instead load the
  // chat template from the specified file, and the tokenizer and model from a
  // local GGUF file at the path `.`
  let loader = GGUFLoaderBuilder::new(
      GGUFSpecificConfig { repeat_last_n: 64 },
      Some("chat_templates/mistral.json".to_string()),
      None,
      ".".to_string(),
      "../bin/prometheus-7b-v2.0.Q2_K.gguf".to_string(),
  )
  .build();
  // Load, into a Pipeline
  let pipeline = loader.load_model_from_hf(
      None,
      TokenSource::CacheToken,
      &ModelDType::Auto,
      &Device::cuda_if_available(0)?,
      false,
      DeviceMapMetadata::dummy(),
      None,
  )?;
  // Create the MistralRs, which is a runner
  Ok(MistralRsBuilder::new(pipeline, SchedulerMethod::Fixed(5.try_into().unwrap())).build())
}

// #[napi]
// pub fn prompt() -> Result<(), Box<dyn std::error::Error>> {
//     let mistralrs = setup()?;

//     let (tx, mut rx) = channel(10_000);
//     let request = Request::Normal(NormalRequest {
//         messages: RequestMessage::Completion {
//             text: "Hello! My name is ".to_string(),
//             echo_prompt: false,
//             best_of: 1,
//         },
//         sampling_params: SamplingParams::default(),
//         response: tx,
//         return_logprobs: false,
//         is_streaming: false,
//         id: 0,
//         constraint: Constraint::None,
//         suffix: None,
//         adapters: None,
//     });
//     mistralrs.get_sender().blocking_send(request)?;

//     let response = rx.blocking_recv().unwrap();
//     match response {
//         Response::CompletionDone(c) => println!("Text: {}", c.choices[0].text),
//         _ => unreachable!(),
//     }
//     Ok(())
// }

#[napi]
pub fn prompt() -> Result<String, napi::Error> {
    let mistralrs = setup().map_err(|e| Error::from_reason(format!("{}", e)))?;

    let (tx, mut rx) = channel(10_000);
    let request = Request::Normal(NormalRequest {
        messages: RequestMessage::Completion {
            text: "Hello! My name is ".to_string(),
            echo_prompt: false,
            best_of: 1,
        },
        sampling_params: SamplingParams::default(),
        response: tx,
        return_logprobs: false,
        is_streaming: false,
        id: 0,
        constraint: Constraint::None,
        suffix: None,
        adapters: None,
    });
    mistralrs.get_sender().blocking_send(request).map_err(|e| Error::from_reason(format!("{}", e)))?;

    if let Some(response) = rx.blocking_recv() {
        match response {
            Response::CompletionDone(c) => Ok::<String, napi::Error>(c.choices[0].text.to_string()),// println!("Text: {}", c.choices[0].text),
            _ => unreachable!(),
        };
    } else {
        eprintln!("Failed to receive a response");
    }
    Ok("".to_string())
}