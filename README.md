<!-- DO NOT EDIT README.md (It will be overridden by README.hbs) -->

# fix-set

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Description](#description)
  - [Rule Priority](#rule-priority)
- [Synopsis](#synopsis)
  - [Why both `include` and `exclude`?](#why-both-include-and-exclude)
- [API](#api)
  - [Classes](#classes)
  - [Typedefs](#typedefs)
  - [FixSet](#fixset)
    - [new FixSet([config])](#new-fixsetconfig)
    - [fixSet.getName(element, [options]) ⇒ <code>string</code> \| <code>undefined</code>](#fixsetgetnameelement-options-%E2%87%92-codestringcode-%5C-codeundefinedcode)
    - [fixSet.has(element) ⇒ <code>boolean</code>](#fixsethaselement-%E2%87%92-codebooleancode)
  - [FixSetConfig : <code>Object</code>](#fixsetconfig--codeobjectcode)
  - [RuleConfig : <code>Object</code>](#ruleconfig--codeobjectcode)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Description

`fix-set` module lets you define simple prefix, suffix and exception rules and test strings against those rules.

Possible use cases:

* Filter query parameters from a web form.
* Filter custom HTTP header fields.

## Rule Priority

* Rules: `exclude` > `include`
* Inside Rules: `except` > `elements` > `exceptPrefixes` or `exceptSuffixes` > `prefixes` or `suffixes`
* Prefixes and suffixes has `or` relation. If a string satisfies one of them, rule is satisfied.
* If no `prefixes` and `suffixes` provided, it is assumed all strings are included in rule except `exceptPrefixes` and `exceptSuffixes`.

# Synopsis

**TypeScript**
```js
import FixSet, { RuleConfig, FixSetConfig } from 'fix-set';
```

**JavaScript**
```js
import FixSet from 'fix-set';
```

--------------

```js
// Whitelist: Include only strings starting with 'q' but not 'qX'.
const fixSet = new FixSet({
  include: {
    prefixes:       'q',
    exceptPrefixes: 'qx',
    replacePrefix:  true,
    replaceSuffix:  true
  }
});

const name       = fixSet.getName('qMemberName');   // 'MemberName'
const has        = fixSet.has('qMemberName');       // true
const otherField = fixSet.getName('qxOther');       // undefined
const otherHas   = fixSet.has('qxOther');           // false
```

```js
// Blacklist: Include all strings excluding which begins with 'q',
// but include strings beginning with 'qX' even they also begin with 'q'.
const fixSet = new FixSet({
  exclude: {
    prefixes:       'q',
    exceptPrefixes: 'qx',
    replacePrefix:  true,
    replaceSuffix:  true
  }
});

const name       = fixSet.getName('qMemberName');   // undefined
const has        = fixSet.has('qMemberName');       // false
const otherField = fixSet.getName('qxOther');       // Other
const otherHas   = fixSet.has('qxOther');           // true
```

```js
  // Usage with Array#filter, Array#map etc.
  // Get included field names.
  const parameters = Object.keys(formParameters).filter(param => fixSet.has(param));
  const dbFields   = Object.keys(formParameters)
    .map(param => fixSet.getName(param))
    .filter(field => field !== undefined);
```

```js
// Usage with lodash.
import lodash from 'lodash';
const filteredObject = lodash.pickBy(data, (value, key) => fixSet.has(key));
```

```js
// Cover only strings starting with 'q' or /^=(.+?)=/.
const fixSet = new FixSet({
  include: {
    prefixes:      ['q', /^=(.+?)=/],
    replacePrefix: true,
    replaceSuffix: true
  }
});
const name = fixSet.getName('qMemberName');     // 'MemberName'
const has  = fixSet.has('qMemberName');         // true
const has  = fixSet.has('=eq=MemberName');      // true
const has  = fixSet.getName('=eq=MemberName');  // 'MemberName'
```

## Why both `include` and `exclude`?

Consider two scenarios below:

* Include all strings, but not starting with 'q'. However include starting with 'qx': `{ exclude: { prefixes: 'q', exceptPrefixes: 'qx' } }`
* Exclude all strings, but not starting with 'q'. However exclude starting with 'qx' `{ include: { prefixes: 'q', exceptPrefixes: 'qx' } }`

# API
## Classes

<dl>
<dt><a href="#FixSet">FixSet</a></dt>
<dd><p>Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
can be tested if they are covered by this rule.</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#FixSetConfig">FixSetConfig</a> : <code>Object</code></dt>
<dd><p>Fix rule configuration.</p></dd>
<dt><a href="#RuleConfig">RuleConfig</a> : <code>Object</code></dt>
<dd><p>Fix rule options to create a fix rule from given options. Prefix and suffix parameters can be either string
or regular expression. If they are provided as regular expressions, they must begin with <code>^</code> or end with <code>$</code>.
If no <code>prefixes</code> and <code>suffixes</code> provided, it is assumed all strings are included except <code>exceptPrefixes</code>
and <code>exceptSuffixes</code>.</p></dd>
</dl>

<a name="FixSet"></a>

## FixSet
<p>Class representing a filter rule. A rule consists of prefixes, elements and disallowed elements etc. Later individual elements
can be tested if they are covered by this rule.</p>

**Kind**: global class  

* [FixSet](#FixSet)
    * [new FixSet([config])](#new_FixSet_new)
    * [.getName(element, [options])](#FixSet+getName) ⇒ <code>string</code> \| <code>undefined</code>
    * [.has(element)](#FixSet+has) ⇒ <code>boolean</code>

<a name="new_FixSet_new"></a>

### new FixSet([config])
<p>Creates FixSet object. If no <code>include</code> or <code>exclude</code> parameters provided or empty configurations are provided, they
would be skipped.</p>


| Param | Type | Description |
| --- | --- | --- |
| [config] | [<code>FixSetConfig</code>](#FixSetConfig) | <p>Configuration.</p> |

<a name="FixSet+getName"></a>

### fixSet.getName(element, [options]) ⇒ <code>string</code> \| <code>undefined</code>
<p>Returns element name if it is covered by rule. Returns undefined otherwise. Prefix and suffix in element name
is replaced if requested by rule.</p>

**Kind**: instance method of [<code>FixSet</code>](#FixSet)  
**Returns**: <code>string</code> \| <code>undefined</code> - <ul>
<li>Element name if it is covered by rule, undefined otherwise. Name getName prefix and suffix replaced if requested by rule.</li>
</ul>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| element | <code>string</code> |  | <p>Element name to test whether it is covered by rule.</p> |
| [options] | <code>Object</code> | <code>{}</code> | <p>Options</p> |
| [options.replacePrefix] | <code>boolean</code> \| <code>undefined</code> |  | <p>Whether it should prefix be stripped from start of field name. Defaults to value given during object cunstruction.</p> |
| [options.replaceSuffix] | <code>boolean</code> \| <code>undefined</code> |  | <p>Whether it should suffix be stripped from end of field name. Defaults to value given during object cunstruction.</p> |

<a name="FixSet+has"></a>

### fixSet.has(element) ⇒ <code>boolean</code>
<p>Returns whether element is covered by rules.</p>

**Kind**: instance method of [<code>FixSet</code>](#FixSet)  
**Returns**: <code>boolean</code> - <ul>
<li>Whether element is covered by rule.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>string</code> | <p>Element name to test.</p> |

<a name="FixSetConfig"></a>

## FixSetConfig : <code>Object</code>
<p>Fix rule configuration.</p>

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| include | [<code>RuleConfig</code>](#RuleConfig) | <p>Configuration rules for included fields.</p> |
| exclude | [<code>RuleConfig</code>](#RuleConfig) | <p>Configuration rules for excluded fields.</p> |

<a name="RuleConfig"></a>

## RuleConfig : <code>Object</code>
<p>Fix rule options to create a fix rule from given options. Prefix and suffix parameters can be either string
or regular expression. If they are provided as regular expressions, they must begin with <code>^</code> or end with <code>$</code>.
If no <code>prefixes</code> and <code>suffixes</code> provided, it is assumed all strings are included except <code>exceptPrefixes</code>
and <code>exceptSuffixes</code>.</p>

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| elements | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> | <p>Strings which are covered by rule. They are compared by equal operator.</p> |
| except | <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> | <p>Fields which are not covered by rule.</p> |
| prefixes | <code>string</code> \| <code>RegExp</code> \| <code>Array.&lt;(string\|RegExp)&gt;</code> \| <code>Set.&lt;(string\|RegExp)&gt;</code> | <p>Strings which starts with given prefixes are covered by rule.</p> |
| suffixes | <code>string</code> \| <code>RegExp</code> \| <code>Array.&lt;(string\|RegExp)&gt;</code> \| <code>Set.&lt;(string\|RegExp)&gt;</code> | <p>Strings which ends with given suffixes are covered by rule.</p> |
| exceptPrefixes | <code>string</code> \| <code>RegExp</code> \| <code>Array.&lt;(string\|RegExp)&gt;</code> \| <code>Set.&lt;(string\|RegExp)&gt;</code> | <p>Strings which starts with given prefixes are NOT covered by rule.</p> |
| exceptSuffixes | <code>string</code> \| <code>RegExp</code> \| <code>Array.&lt;(string\|RegExp)&gt;</code> \| <code>Set.&lt;(string\|RegExp)&gt;</code> | <p>Strings which ends with given suffixes are NOT covered by rule.</p> |
| replacePrefix | <code>boolean</code> | <p>Whether it should prefix be stripped from start of field name</p> |
| replaceSuffix | <code>boolean</code> | <p>Whether it should suffix be stripped from end of field name.</p> |

